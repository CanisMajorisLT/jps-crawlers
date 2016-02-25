import mongoose from 'mongoose'


const MODEL_NAME = 'CrawlLog';

const CrawlLogSchema = new mongoose.Schema({
    crawlDate: Date,
    duration: String,
    sources: [String],
    errors: mongoose.Schema.Types.Mixed // TODO
});

mongoose.model(MODEL_NAME, CrawlLogSchema);