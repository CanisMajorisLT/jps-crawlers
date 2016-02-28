var config = require('./config');
var cron = require('crontab');

var createCronForCrawler;

function crontabInit(error, crontab) {
    error && console.error('Failed to startup crontab', error);

    createCronForCrawler = function createCronForCrawler(directConfig) {
        var jobId = '0de4eb77-dd9b-428c-a92e-12e6b339bd33';
        var conf = directConfig || config;
        var interval = Math.max(1, parseInt(conf.general.crawlInterval));

        // cleanup
        crontab.remove({comment: jobId});

        var job = crontab.create('node app.js', null, jobId);
        job.hour().at(0).every(interval);

        if (job === null) {
            console.log('failed to create/update cronjob');
        } else {
            console.log('successfully created/updated cronjob', job);
        }

        crontab.save(function(error, crontab) {
            error && console.log('failed to save crontab', error);
        })
    };
}

if (process.env.NODE_ENV === 'prod') {
    cron.load(crontabInit())
} else {
    // mock when we are on dev (windows machine)
    createCronForCrawler = function() {
        console.log('updating crontab [mock-windows]');
    }
}

if (require.main === module) {
    // module ran from command line
    createCronForCrawler();
} else {
    console.log('crontab imported');
}

module.exports = createCronForCrawler;

