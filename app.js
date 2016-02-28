require('babel-polyfill');
require('./build/db/db');
var mongoose = require('mongoose');
var crawlers = require('./build/crawlers/main');
var getConfig = require('./config');
var logger = require('./logging/logger');

var CrawlLog = mongoose.model('CrawlLog');
var ParsedAd = mongoose.model('ParsedAd');

// use same date entry for all docs saved on this crawl
var crawlDate = new Date();

function saveToDb(result, site, task) {
    ParsedAd.insertDocs(result, site, crawlDate);
}

function getCurrentCrawlErrors() {
    return new Promise(function(resolve, reject) {
        logger.query({
            from: crawlDate,
            until: new Date(),
            start: 0,
            order: 'desc'
        }, function(error, result) {
            error && reject(error);
            resolve(result['error-logger'])
        })
    })

}

function createCrawlLog() {
    getCurrentCrawlErrors().then(function(errorsLog) {
        var log = new CrawlLog({
            crawlDate: crawlDate,
            duration: new Date() - crawlDate,
            sources: ['CVB', 'CVO'],
            crawlErrors: errorsLog
        });

        log.save(function(error, doc){
            logger.info('Successfully created crawl log', {doc: doc})
        })
    })
}

function performCrawl(config) {
    crawlers.crawl({
        taskSuccessHandler: saveToDb,
        onDone: function() {
            createCrawlLog();
        },
        config: config
    });
}

function intervalCrawl() {
    // TODO check last prsed time from db, and avoid running until its time again (during deployments)
    var HOUR = 1000 * 60 * 60;
    var config = getConfig();
    var nextCrawlIn = Math.max(1, parseInt(config.general.crawlInterval)) * HOUR;
    logger.info('Starting crawler with config', config);

    performCrawl(config);

    logger.info('Next crawl in ', nextCrawlIn);
    setTimeout(intervalCrawl, nextCrawlIn)
}

intervalCrawl();
