require('babel-polyfill');
require('./build/db/db');
var mongoose = require('mongoose');
var crawlers = require('./build/crawlers/main');


var CrawlLog = mongoose.model('CrawlLog');
var ParsedAd = mongoose.model('ParsedAd');

// use same date entry for all docs saved on this crawl
var crawlDate = new Date();
var savingToDbPromises = [];

function saveToDb(result, site, task) {
    var prom = ParsedAd.insertDocs(result, site, crawlDate);
    savingToDbPromises.push(prom)
}

function createCrawlLog() {
    var prom = new Promise(function(resolve, reject){
        var log = new CrawlLog({
            crawlDate: crawlDate,
            crawlDuration: new Date() - crawlDate,
            sources: ['CVB', 'CVO']
        });

        log.save(function(error, doc){
            resolve()
        })
    });

    savingToDbPromises.push(prom)
}

function closeMongoConnection() {
    mongoose.disconnect();
}


crawlers.crawl({
    taskSuccessHandler: saveToDb,
    onDone: function(){
        createCrawlLog();
        Promise.all(savingToDbPromises)
            .then(closeMongoConnection)
    }
});
