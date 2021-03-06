import mongoose from 'mongoose'


const MODEL_NAME = 'CrawlLog';

const CrawlLogSchema = new mongoose.Schema({
    crawlDate: Date,
    duration: String,
    sources: [String],
    crawlErrors: mongoose.Schema.Types.Mixed
});

mongoose.model(MODEL_NAME, CrawlLogSchema);