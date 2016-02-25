import mongoose from 'mongoose'


const MODEL_NAME = 'CrawlLog';

const CrawlLogSchema = new mongoose.Schema({
    crawlDate: Date,
    crawlDuration: String,
    crawledSources: [String]
});

mongoose.model(MODEL_NAME, CrawlLogSchema);