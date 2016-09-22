require('babel-polyfill');
require('./build/db/db');
var mongoose = require('mongoose');
var crawlers = require('./build/crawlers/main');
var getConfig = require('./config');
var logger = require('./logging/logger');

var CrawlLog = mongoose.model('CrawlLog');
var ParsedAd = mongoose.model('ParsedAd');

// use same date entry for all docs saved on this crawl
var crawlDate;

function saveToDb(result, site, task) {
    ParsedAd.insertDocs(result, site, crawlDate);
}

function getCurrentCrawlErrors() {
    return new Promise(function(resolve, reject) {
        logger.query({
            from: crawlDate, // TODO loggly ignores from, until (or maybe converts to some time or something)
            until: new Date(),
            start: 0,
            query: 'error',
            order: 'desc'
        }, function(error, result) {
            error && reject(error);
            resolve(result['error-logger'])
        })
    })

}

function createCrawlLog() {
    function createLog(errorsLog) {
        var log = new CrawlLog({
            crawlDate: crawlDate,
            duration: new Date() - crawlDate,
            sources: ['CVB', 'CVO'],
            crawlErrors: errorsLog
        });

        log.save(function(error, doc) {
            logger.info('Successfully created crawl log')
        })
    }

    getCurrentCrawlErrors()
        .then(function(errorsLog) {
            createLog(errorsLog)
        })
        .catch(function(error) {
            createLog([error]);
            logger.error('Failed to get getCurrentCrawlErrors', {error: error})
        })
}

function performCrawl(config) {
    crawlDate = new Date();
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
