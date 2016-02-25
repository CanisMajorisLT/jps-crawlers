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

_mongoose2.default.model(MODEL_NAME, CrawlLogSchema);
//# sourceMappingURL=crawlLog.js.map