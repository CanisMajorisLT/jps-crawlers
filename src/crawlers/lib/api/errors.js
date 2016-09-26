
export const PARSER_ERROR = 'ParserError';
export const FETCH_ERROR = 'ParserError';

function CustomError(name, metaData) {
    this.name = name;
    this.metaData = metaData;
}

export function makeParserError(element, parserName, validator) {
    return new CustomError(PARSER_ERROR, {
        element,
        parserName,
        validator
    })
}

export function makeFetchError(uri, info) {
    return new CustomError(FETCH_ERROR, {
        uri,
        info
    })
}