'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODEL_NAME = 'CrawlLog';

var CrawlLogSchema = new _mongoose2.default.Schema({
    crawlDate: Date,
    duration: String,
    sources: [String]
    //errors: mongoose.Schema.Types.Mixed // TODO
});

_mongoose2.default.model(MODEL_NAME, CrawlLogSchema);
//# sourceMappingURL=crawlLog.js.map
