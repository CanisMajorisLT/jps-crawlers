'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNumberOfFrontPages = undefined;


/**
 * Parses given uri with provided parser to get number of pages to parse
 * @param {string} uri
 * @param {function} parser
 * @returns {Number}
 */

var getNumberOfFrontPages = exports.getNumberOfFrontPages = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(uri, parser) {
        var html;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _scrape.getPageBody)(uri);

                    case 3:
                        html = _context.sent;
                        return _context.abrupt('return', parseInt(parser(html)));

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);

                        _logger2.default.error('getNumberOfFrontPages threw error', _context.t0);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 7]]);
    }));

    return function getNumberOfFrontPages(_x3, _x4) {
        return ref.apply(this, arguments);
    };
}();

/**
 * Parses given page to extract all info about ads.
 * Used as task in queue worker.
 * @param {string} uri
 * @param {function} parser
 * @returns {function} parseFrontPage
 */


exports.generateFrontInfoTasks = generateFrontInfoTasks;
exports.parseFrontPageArticlesFactory = parseFrontPageArticlesFactory;
exports.handleTaskSuccessFactory = handleTaskSuccessFactory;
exports.handleTaskFailureFactory = handleTaskFailureFactory;

var _scrape = require('./scrape');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _utils = require('./utils');

var _queueWorkerFactory = require('./queueWorkerFactory');

var _logger = require('../../../logging/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var DEFAULT_TASK_DELAY = 1000;
var DEFAULT_TASK_REQUEUE = 5;
var DEFAULT_TASK_RETRY = 3;
var DEFAULT_TASK_RETRY_INTERVAL = 200;

var defaultConfig = {
    DEFAULT_TASK_DELAY: DEFAULT_TASK_DELAY,
    DEFAULT_TASK_REQUEUE: DEFAULT_TASK_REQUEUE,
    DEFAULT_TASK_RETRY: DEFAULT_TASK_RETRY,
    DEFAULT_TASK_RETRY_INTERVAL: DEFAULT_TASK_RETRY_INTERVAL
};

/**
 * Generates object used for doing parse task
 * @param pageNumber
 * @param {object=} config
 * @returns {{pageNumber: *, expires: *, requeue: number, timesRequeued: number, retry: number, retryInterval: number, delay: number}}
 */
function generateFrontInfoTask(pageNumber) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? defaultConfig : arguments[1];

    return {
        pageNumber: pageNumber,
        expires: (0, _utils.datePlusHours)(1),
        requeue: config.DEFAULT_TASK_REQUEUE, // optional
        timesRequeued: 0, // optional
        retry: config.DEFAULT_TASK_RETRY, // optional
        retryInterval: config.DEFAULT_TASK_RETRY_INTERVAL, // optional
        delay: config.DEFAULT_TASK_DELAY //optional
    };
}

/**
 * Generates n number of tasks for worker
 * @param {number} n
 * @param {number=0} startIndex
 * @returns {Array}
 */
function generateFrontInfoTasks(n) {
    var startIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var config = arguments[2];

    var tasks = [];
    for (var i = startIndex; i <= n; i++) {
        tasks.push(generateFrontInfoTask(i, config));
    }

    return tasks;
}function parseFrontPageArticlesFactory(uri, parser) {

    return function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(task) {
            var fullUri, html;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            fullUri = uri.replace('${page}', task.pageNumber);
                            _context2.next = 3;
                            return (0, _scrape.getPageBody)(fullUri);

                        case 3:
                            html = _context2.sent;
                            return _context2.abrupt('return', parser(html, task));

                        case 5:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function parseFrontPage(_x5) {
            return ref.apply(this, arguments);
        };
    }();
}

function handleTaskSuccessFactory(site, callback) {
    return function handleTaskSuccess(_ref) {
        var result = _ref.result;
        var task = _ref.task;

        _logger2.default.info(site + ' Successfully finished parsing front page nr ' + task.pageNumber);

        // write to DB
        callback && callback(result, site, task);
    };
}

function handleTaskFailureFactory(site) {
    var queue = undefined;

    function handleTaskFailure(_ref2) {
        var error = _ref2.error;
        var task = _ref2.task;

        _logger2.default.error(site + ' Task failed', { error: error, task: task });
        if (task.requeue && task.requeue > 0 && task.timesRequeued < task.requeue) {
            ++task.timesRequeued;

            queue.push(task);
        } else {
            _logger2.default.error('Task failed too many times, all requeues exausted');
        }
    }

    return {
        handler: handleTaskFailure,
        setQueue: function setQueue(q) {
            queue = q;
        }
    };
}
//# sourceMappingURL=core.js.map
