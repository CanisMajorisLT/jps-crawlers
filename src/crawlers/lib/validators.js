import { isArray, isFinite as isNumber_, isDate as isDate_ } from 'lodash'
import { makeParserError } from './errors'

/**
 * Wraps a html parser function and validates its return value against
 * supplied validators. On validation fail, throw custom parser error.
 *
 * @param {Function} fnc
 * @param {Array} validators
 * @returns {Function}
 */
export function validateParse(fnc, validators) { //TODO test
    const parserName = fnc.name;

    function errorWrapperForParserFunctions() {
        const element = arguments[0];
        const result = fnc.apply(this, arguments);
        const elementToLog = element.html ? element.html() : element;

        validators.forEach((validator)=> {
            if (!validator(result)) {
                throw makeParserError(elementToLog.slice(0, 300), parserName, validator.name)
            }
        });

        return result
    }

    return errorWrapperForParserFunctions
}

export function isNotEmptyString(v) {
    return v !== ''
}

export function isNumber(v) {
    return isNumber_(v)
}

export function isNotEmptyArray(v) {
    return isArray(v) && v.length > 0
}

export const ELEMENT_NOT_FOUND = '@@ELEMENT_NOT_FOUND';

export function isNotElementNotFound(v) {
    return v !== ELEMENT_NOT_FOUND
}

export function isDate(v) {
    return isDate_(v)
}



