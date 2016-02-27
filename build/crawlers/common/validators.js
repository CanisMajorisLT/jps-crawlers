'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ELEMENT_NOT_FOUND = undefined;
exports.validateParse = validateParse;
exports.isNotEmptyString = isNotEmptyString;
exports.isNumber = isNumber;
exports.isNotEmptyArray = isNotEmptyArray;
exports.isNotElementNotFound = isNotElementNotFound;
exports.isDate = isDate;

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
                throw (0, _errors.makeParserError)(element.html ? element.html() : element, parserName, validator.name);
            }
        });

        return result;
    }

    return errorWrapperForParserFunctions;
}

function isNotEmptyString(v) {
    return v !== '';
}

function isNumber(v) {
    return (0, _lodash.isFinite)(v);
}

function isNotEmptyArray(v) {
    return (0, _lodash.isArray)(v) && v.length > 0;
}

var ELEMENT_NOT_FOUND = exports.ELEMENT_NOT_FOUND = '@@ELEMENT_NOT_FOUND';

function isNotElementNotFound(v) {
    return v !== ELEMENT_NOT_FOUND;
}

function isDate(v) {
    return (0, _lodash.isDate)(v);
}
//# sourceMappingURL=validators.js.map
