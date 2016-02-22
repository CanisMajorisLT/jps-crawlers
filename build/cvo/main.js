'use strict';

/**
 * Parses page further enough that it has no ads, but link to last page with ads
 * and thus returns total number of pages with ads.
 * @returns {Number}
 */

var getNumberOfFrontPages = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var html;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _scrape.getPageBody)(FRONT_PAGE_URI.replace('${page}', '200'));

                    case 3:
                        html = _context.sent;
                        return _context.abrupt('return', parseInt((0, _parser.extractTotalPageCount)(html)));

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);

                        console.log('getNumberOfFrontPages threw error', _context.t0);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 7]]);
    }));

    return function getNumberOfFrontPages() {
        return ref.apply(this, arguments);
    };
}();

/**
 * Parses given page n to extract all info about ads.
 * Used as task in queue worker
 * @param task
 * @returns {*}
 */


var parseFrontPage = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(task) {
        var pageNumber, uri, html;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        pageNumber = task.pageNumber;
                        uri = FRONT_PAGE_URI.replace('${page}', pageNumber);
                        _context2.next = 4;
                        return (0, _scrape.getPageBody)(uri);

                    case 4:
                        html = _context2.sent;
                        return _context2.abrupt('return', (0, _parser.extractFrontInfo)(html));

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function parseFrontPage(_x) {
        return ref.apply(this, arguments);
    };
}();

var parseCVO = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var handleTaskFail, worker, FrontInfoFetchingQueue, pages, tasks;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        handleTaskFail = handleTaskFailureWrapper();
                        worker = (0, _queueWorkerFactory.queueWorkerFactory)(parseFrontPage, handleTaskFail.handler, handleTaskSuccess);
                        FrontInfoFetchingQueue = _async2.default.queue(worker, DEFAULT_WORKERS_NUMBER);


                        handleTaskFail.setQueue(FrontInfoFetchingQueue); // so task can be requeued on fail

                        _context3.next = 6;
                        return getNumberOfFrontPages();

                    case 6:
                        pages = _context3.sent;

                        console.log('Page count: ' + pages);

                        tasks = generateManyFrontInfoTasks(pages);


                        FrontInfoFetchingQueue.push(tasks);

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function parseCVO() {
        return ref.apply(this, arguments);
    };
}();

var _scrape = require('../common/scrape');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _parser = require('./parser');

var _utils = require('../common/utils');

var _queueWorkerFactory = require('../common/queueWorkerFactory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var FRONT_PAGE_URI = 'http://www.cvonline.lt/darbo-skelbimai/visi?page=${page}';
var DEFAULT_WORKERS_NUMBER = 1;
var DEFAULT_TASK_DELAY = 1000;
var DEFAULT_TASK_REQUEUE = 5;
var DEFAULT_TASK_RETRY = 3;
var DEFAULT_TASK_RETRY_INTERVAL = 200;

/**
 * Generates object used for doing parse task
 * @param pageNumber
 * @returns {{pageNumber: *, expires: *, requeue: number, timesRequeued: number, retry: number, retryInterval: number, delay: number}}
 */
function generateFrontInfoTask(pageNumber) {
    return {
        pageNumber: pageNumber,
        expires: (0, _utils.datePlusHours)(1),
        requeue: DEFAULT_TASK_REQUEUE, // optional
        timesRequeued: 0, // optional
        retry: DEFAULT_TASK_RETRY, // optional
        retryInterval: DEFAULT_TASK_RETRY_INTERVAL, // optional
        delay: DEFAULT_TASK_DELAY //optional
    };
}

function generateManyFrontInfoTasks(n) {
    var tasks = [];
    for (var i = 0; i <= n; i++) {
        tasks.push(generateFrontInfoTask(i));
    }

    return tasks;
}

function handleTaskSuccess(_ref) {
    var result = _ref.result;
    var task = _ref.task;

    console.log('Successfully finished parsing front page nr ' + task.pageNumber);
    console.log(result);
    // write to DB, pass down for metadata add
}

function handleTaskFailureWrapper() {
    var queue = undefined;

    function handleTaskFailure(_ref2) {
        var error = _ref2.error;
        var task = _ref2.task;

        console.error('Task failed', error, task);
        if (task.requeue && task.requeue > 0 && task.timesRequeued < task.requeue) {
            ++task.timesRequeued;

            queue.push(task);
        } else {
            // log error so somethere
        }
    }

    return {
        handler: handleTaskFailure,
        setQueue: function setQueue(q) {
            queue = q;
        }
    };
}

parseCVO();
//# sourceMappingURL=main.js.map