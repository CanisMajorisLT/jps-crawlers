'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');


var configPath = _path2.default.join(__dirname, '../..', 'jps-crawlerrc');

var app = (0, _express2.default)();

app.get('/write', function (req, res) {
    writeConfig();
    res.send('Wrote');
});

app.get('/read', function () {
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

                        res.send(config);

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

app.listen(process.env.PORT || 3000);
console.log('Listenign on ', process.env.PORT);

function readConfig() {
    return new Promise(function (resolve, rejecr) {
        _fs2.default.readFile(configPath, function (err, content) {
            resolve(JSON.parse(content));
        });
    });
}

function writeConfig() {
    var newData = { "config": "Bye world :)" + new Date() };
    _fs2.default.writeFile(configPath, JSON.stringify(newData), function () {
        console.log('Wrote config!');
    });
}
//# sourceMappingURL=main.js.map