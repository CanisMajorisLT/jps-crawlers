import mongoose from 'mongoose'
import logger from '../../../logging/logger'

// TODO [refactor] use nodejs native mongo db driver, to insert dynamically created docs
// construct API to dynamically create doc models

const MODEL_NAME = 'ParsedAd';

const ParsedAdSchema = new mongoose.Schema({
    adId: String,
    source: String,
    parsedData: {
        uri: String,
        title: String,
        city: String,
        company: String,
        companySecondary: String,
        views: Number
    },
    meta: {
        parseDate: Date, // should be same value for all entries on single crawl
        adIndex: Number,
        pageNumber: Number
    }
});

ParsedAdSchema.statics.insertDocs = function insertDocs(data, source, date) {

    const dataForInsert = data.map((ad)=> {
        return {
            adId: ad.id,
            source: source,
            parsedData: {
                uri: ad.uri,
                title: ad.title,
                city: ad.city,
                company: ad.company,
                companySecondary: ad.companySecondary,
                views: ad.views
            },
            meta: {
                parseDate: date,
                adIndex: ad.meta.adIndex,
                pageNumber: ad.meta.pageNumber
            }
        }
    });

    this.create(dataForInsert, (error)=> {
        logger.debug('successfully created parsedads');
        error && logger.error('Error  while creating new ParsedAd', {error});
    })
};


mongoose.model(MODEL_NAME, ParsedAdSchema);