var logger = require('./logging/logger');

var crawlDate = new Date - 6000;

function getCurrentCrawlErrors() {
    console.log('get logs', crawlDate, new Date());
    return new Promise(function(resolve, reject) {
        logger.query({
            from: new Date().getTime() - 6000,
            query: 'error',
            order: 'desc'
        }, function(error, result) {
            error && reject(error);
            resolve(result['error-logger'])
        })
    })
}

getCurrentCrawlErrors().then(function(r) {
    console.log(r.length);
})