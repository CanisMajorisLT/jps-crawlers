import { isArray } from 'lodash'
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

        validators.forEach((validator)=> {
            if (!validator(result)) {
                throw makeParserError(element.html ? element.html() : element, parserName, validator.name)
            }
        });

        return result
    }

    return errorWrapperForParserFunctions
}

export function notEmptyString(v) {
    return v !== ''
}

export function isNumber(v) {
    return typeof v === 'number'
}

export function isNotEmptyArray(v) {
    return isArray(v) && v.length > 0
}