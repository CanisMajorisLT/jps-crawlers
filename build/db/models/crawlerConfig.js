'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODEL_NAME = 'CrawlerConfig';

var CrawlLogSchema = new _mongoose2.default.Schema({
    general: {
        'crawlInterval': { type: Number, default: 200000 },
        'workers': { type: Number, default: 1 }
    },
    task: {
        'DEFAULT_TASK_DELAY': { type: Number, default: 10000 },
        'DEFAULT_TASK_REQUEUE': { type: Number, default: 5 },
        'DEFAULT_TASK_RETRY': { type: Number, default: 5 },
        'DEFAULT_TASK_RETRY_INTERVAL': { type: Number, default: 100 }
    }
});

_mongoose2.default.model(MODEL_NAME, CrawlLogSchema);
//# sourceMappingURL=crawlerConfig.js.map
