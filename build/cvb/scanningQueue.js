'use strict';

var worker = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(task, callback) {
        var adsInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;

                        if (!task.delay) {
                            _context.next = 4;
                            break;
                        }

                        _context.next = 4;
                        return sleep(task.delay);

                    case 4:
                        _context.next = 6;
                        return parseFrontPage(task.pageNumber);

                    case 6:
                        adsInfo = _context.sent;


                        console.log('@worker finished task successfully, dunno what to do', adsInfo);
                        callback();
                        _context.next = 14;
                        break;

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](0);

                        callback(_context.t0);

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 11]]);
    }));

    return function worker(_x, _x2) {
        return ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=scanningQueue.js.map