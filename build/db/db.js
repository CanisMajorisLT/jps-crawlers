'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _parsedAd = require('./models/parsedAd');

var _parsedAd2 = _interopRequireDefault(_parsedAd);

var _crawlLog = require('./models/crawlLog');

var _crawlLog2 = _interopRequireDefault(_crawlLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MONGODB_ADDRESS = process.env.NODE_ENV === 'prod' ? process.env.MONGO_URL : 'mongodb://localhost:27017';

_mongoose2.default.connect(MONGODB_ADDRESS);

// load models
//# sourceMappingURL=db.js.map