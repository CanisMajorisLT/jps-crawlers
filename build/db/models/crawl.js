'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODEL_NAME = 'CrawlLog';

var CrawlLogSchema = new _mongoose2.default.Schema({
    crawlDate: Date,
    crawlDuration: String,
    crawledSources: [String]
});

/*CrawlLogSchema.statics.create = function create(data, source) {
    //const ParsedAdModel = this.Model(MODEL_NAME);
    this.create({
        adId: data.id,
        source: source,
        parseDate: {
            uri: data.uri,
            title: data.title,
            city: data.city,
            company: data.company,
            companySecondary: data.companySecondary,
            views: data.views
        },
        meta: {
            adIndex: data.adIndex,
            pageNumber: data.pageNumber
        }
    }, (error, doc)=> {
        error && console.log('Error  while creating new ParsedAd', error);
    })

};*/

_mongoose2.default.model(MODEL_NAME, CrawlLogSchema);
//# sourceMappingURL=crawl.js.map