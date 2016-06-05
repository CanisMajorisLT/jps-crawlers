require('babel-polyfill');
require('../../../build/db/db');
import mongoose from 'mongoose';
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import logger from '../../../logging/logger'

var CrawlLog = mongoose.model('CrawlLog');
var ParsedAd = mongoose.model('ParsedAd');

const configPath = path.join(__dirname, '../../..', '.jps-crawlerrc');

const app = express();
app.use(express.static(path.join(__dirname, '../../..', 'public')));
app.use(bodyParser());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../..', 'public/index.html'))
});

app.get('/options', async function(req, res) {
    const config = await readConfig();
    res.json(config); // TODO add fail
});

app.post('/options', async function(req, res) {
    try {
        const newConfig = req.body;
        await writeConfig(newConfig);
        res.json({success: true});

    } catch (e) {
        res.json({success: false, error: e});
    }

});

app.get('/info', async function(req, res) {

    try {
        const crawlLogsData = await CrawlLog.find().sort('-crawlDate').limit(50).exec();
        const parsedAdsNumber = await ParsedAd.find({'meta.parseDate': crawlLogsData[0].crawlDate}).count().exec();
        res.json({success: true, crawlLogs: crawlLogsData, parsedAdsNumber: parsedAdsNumber});
    } catch (e) {
        res.json({success: false, error: e});

    }
    // error log,
    // when is next crawl
    // when was last crawl + short summary of how many parsed, errors
    // totals crawls
    // total ad records
    // # of ads parsed in last 10 crawls [each], some examples of last ads..
});

app.get('/entries', async function(req, res) {
    try {
        const parsedAdsData = await ParsedAd.find().sort({$natural: -1}).limit(50);
        res.json({success: true, parsedAds: parsedAdsData});
    } catch (e) {
        res.json({success: false, error: e});
    }
});

app.listen(process.env.PORT || 3000);
logger.info('Listening on port:', process.env.PORT || 3000);


function readConfig() {
    return new Promise((resolve)=> {
        fs.readFile(configPath, (err, content)=> {
            resolve(JSON.parse(content));
        })
    })

}

function writeConfig(data) {
    return new Promise((resolve, reject)=> {
        fs.writeFile(configPath, JSON.stringify(data), (error)=> {
            error && reject(error);
            resolve()
        })
    })

}
