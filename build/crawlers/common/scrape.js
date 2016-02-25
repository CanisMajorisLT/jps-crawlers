'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPageBody = getPageBody;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPageBody(uri, retries) {
    //TODO test
    var triesLimit = retries || 5;
    var currentTry = 0;

    var resolveR;
    var rejectR;
    var promiseR = new Promise(function (res, rej) {
        resolveR = res;
        rejectR = rej;
    });

    function recursiveGet() {
        getPage(uri).then(function (body) {
            resolveR(body);
        }).catch(function (error) {
            currentTry++;
            if (currentTry < triesLimit) {
                setTimeout(recursiveGet, currentTry * 100);
            } else {
                rejectR((0, _errors.makeFetchError)(uri, error.error));
            }
        });
    }

    recursiveGet();

    return promiseR;
};

function getPage(uri) {
    var options = {
        simple: true, // reject if statusCode !== 2xx
        uri: uri
    };

    return (0, _requestPromise2.default)(options);
}
//# sourceMappingURL=scrape.js.map