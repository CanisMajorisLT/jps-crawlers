"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.datePlusHours = datePlusHours;

var HOUR = 1000 * 60 * 60;

function datePlusHours() {
    var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    return Date.now() + n * HOUR;
}
//# sourceMappingURL=utils.js.map