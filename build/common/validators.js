'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateParse = validateParse;
exports.notEmptyString = notEmptyString;
exports.isNumber = isNumber;
exports.isNotEmptyArray = isNotEmptyArray;

var _lodash = require('lodash');

var _errors = require('./errors');

/**
 * Wraps a html parser function and validates its return value against
 * supplied validators. On validation fail, throw custom parser error.
 *
 * @param {Function} fnc
 * @param {Array} validators
 * @returns {Function}
 */
function validateParse(fnc, validators) {
    //TODO test
    var parserName = fnc.name;

    function errorWrapperForParserFunctions() {
        var element = arguments[0];
        var result = fnc.apply(this, arguments);

        validators.forEach(function (validator) {
            if (!validator(result)) {
                throw (0, _errors.makeParserError)(element.html(), parserName, validator.name);
            }
        });

        return result;
    }

    return errorWrapperForParserFunctions;
}

function notEmptyString(v) {
    return v !== '';
}

function isNumber(v) {
    return typeof v === 'number';
}

function isNotEmptyArray(v) {
    return (0, _lodash.isArray)(v) && v.length > 0;
}
//# sourceMappingURL=validators.js.map