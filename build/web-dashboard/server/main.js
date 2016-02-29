'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../../../logging/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');


var configPath = _path2.default.join(__dirname, '../../..', '.jps-crawlerrc');

var app = (0, _express2.default)();
app.use(_express2.default.static(_path2.default.join(__dirname, '../../..', 'public')));
app.use((0, _bodyParser2.default)());

app.get('/', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '../../..', 'public/index.html'));
});

app.get('/options', function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
        var config;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return readConfig();

                    case 2:
                        config = _context.sent;

                        res.json(config); // TODO add fail

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x, _x2) {
        return ref.apply(this, arguments);
    };
}());

app.post('/options', function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
        var newConfig;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        newConfig = req.body;
                        _context2.next = 4;
                        return writeConfig(newConfig);

                    case 4:
                        res.json({ success: true });

                        _context2.next = 10;
                        break;

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2['catch'](0);

                        res.json({ success: false, error: _context2.t0 });

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 7]]);
    }));

    return function (_x3, _x4) {
        return ref.apply(this, arguments);
    };
}());

app.get('/info', function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function (_x5, _x6) {
        return ref.apply(this, arguments);
    };
}());

// error log,
// when is next crawl
// totals crawls
// total ad records
// # of ads parsed in last 10 crawls [each]
app.listen(process.env.PORT || 30E00);
_logger2.default.info('Listening on port:', process.env.PORT || 3000);

function readConfig() {
    return new Promise(function (resolve) {
        _fs2.default.readFile(configPath, function (err, content) {
            resolve(JSON.parse(content));
        });
    });
}

function writeConfig(data) {
    return new Promise(function (resolve, reject) {
        _fs2.default.writeFile(configPath, JSON.stringify(data), function (error) {
            error && reject(error);
            resolve();
        });
    });
}
//# sourceMappingURL=main.js.map
