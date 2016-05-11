'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.crawl = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var crawl = exports.crawl = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
        var taskSuccessHandler = _ref.taskSuccessHandler;
        var onDone = _ref.onDone;
        var config = _ref.config;

        var _onDoneWrapper, _onDoneWrapper2, onDoneWrapCVB, resolveOnDoneCVB, _onDoneWrapper3, _onDoneWrapper4, onDoneWrapCVO, resolveOnDoneCVO;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _onDoneWrapper = onDoneWrapper();
                        _onDoneWrapper2 = _slicedToArray(_onDoneWrapper, 2);
                        onDoneWrapCVB = _onDoneWrapper2[0];
                        resolveOnDoneCVB = _onDoneWrapper2[1];
                        _onDoneWrapper3 = onDoneWrapper();
                        _onDoneWrapper4 = _slicedToArray(_onDoneWrapper3, 2);
                        onDoneWrapCVO = _onDoneWrapper4[0];
                        resolveOnDoneCVO = _onDoneWrapper4[1];


                        (0, _main2.default)(taskSuccessHandler, config, resolveOnDoneCVB);
                        (0, _main4.default)(taskSuccessHandler, config, resolveOnDoneCVO);

                        _context.next = 12;
                        return Promise.all([onDoneWrapCVB, onDoneWrapCVO]);

                    case 12:
                        _logger2.default.debug('Main crawler wrap, both crawler done promises resolved');
                        onDone();

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function crawl(_x) {
        return ref.apply(this, arguments);
    };
}();

var _main = require('./cvb/main');

var _main2 = _interopRequireDefault(_main);

var _main3 = require('./cvo/main');

var _main4 = _interopRequireDefault(_main3);

var _logger = require('../../logging/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function onDoneWrapper() {
    var res = void 0;
    var prom = new Promise(function (resolve, reject) {
        res = resolve;
    });

    return [prom, res];
}
//# sourceMappingURL=main.js.map
