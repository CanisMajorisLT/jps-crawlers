"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queueWorkerFactory = queueWorkerFactory;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function asyncRetry(fnc, times) {
    var delay = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];
    //TODO test
    return function () {
        var args = arguments;
        var that = this;
        var failed = 0;

        return new Promise(function (resolve, reject) {
            function runSingleTry() {
                fnc.apply(that, args).then(function (r) {
                    return resolve(r);
                }).catch(function (e) {
                    ++failed;

                    if (failed < times) setTimeout(runSingleTry, delay);else reject(e);
                });
            }

            runSingleTry();
        });
    };
}

function queueWorkerFactory(taskConsumer, taskFailureCallback, taskSuccessCallback) {

    return function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(task, callback) {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            result = void 0;
                            _context.prev = 1;

                            if (!task.delay) {
                                _context.next = 5;
                                break;
                            }

                            _context.next = 5;
                            return sleep(task.delay);

                        case 5:
                            if (!task.retry) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 8;
                            return asyncRetry(taskConsumer, task.retry, task.retryInterval)(task);

                        case 8:
                            result = _context.sent;
                            _context.next = 14;
                            break;

                        case 11:
                            _context.next = 13;
                            return taskConsumer(task);

                        case 13:
                            result = _context.sent;

                        case 14:

                            taskSuccessCallback({
                                success: true,
                                task: task,
                                result: result
                            });
                            _context.next = 20;
                            break;

                        case 17:
                            _context.prev = 17;
                            _context.t0 = _context["catch"](1);

                            taskFailureCallback({
                                success: false,
                                task: task,
                                error: _context.t0
                            });

                        case 20:
                            _context.prev = 20;

                            callback();
                            return _context.finish(20);

                        case 23:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 17, 20, 23]]);
        }));

        function worker(_x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return worker;
    }();
}
//# sourceMappingURL=queueWorkerFactory.js.map
