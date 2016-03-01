'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _logger = require('../../../logging/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODEL_NAME = 'ParsedAd';

var ParsedAdSchema = new _mongoose2.default.Schema({
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

    var dataForInsert = data.map(function (ad) {
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
        };
    });

    console.log(dataForInsert);

    this.create(dataForInsert, function (error, doc) {
        _logger2.default.debug('successfully created parsedads');
        error && _logger2.default.error('Error  while creating new ParsedAd', { error: error });
    });
};

ParsedAdSchema.statics.insertMany = function (data, source, date) {};

_mongoose2.default.model(MODEL_NAME, ParsedAdSchema);
//# sourceMappingURL=parsedAd.js.map
