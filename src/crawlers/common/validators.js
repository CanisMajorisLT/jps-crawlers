import { isArray } from 'lodash'
import { makeParserError } from 'errors'


export function validateParse(fnc, validators) { //TODO test
    const parserName = fnc.name;

    function errorWrapperForParserFunctions() {
        const element = arguments[0];
        const result = fnc.apply(this, arguments);

        validators.forEach((validator)=> {
            if (!validator(result)) {
                throw makeParserError(element.html(), parserName, validator.name)
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