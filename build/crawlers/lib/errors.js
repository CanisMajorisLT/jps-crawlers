'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeParserError = makeParserError;
exports.makeFetchError = makeFetchError;
var PARSER_ERROR = exports.PARSER_ERROR = 'ParserError';
var FETCH_ERROR = exports.FETCH_ERROR = 'ParserError';

function CustomError(name, metaData) {
    this.name = name;
    this.metaData = metaData;
}

function makeParserError(element, parserName, validator) {
    return new CustomError(PARSER_ERROR, {
        element: element,
        parserName: parserName,
        validator: validator
    });
}

function makeFetchError(uri, info) {
    return new CustomError(FETCH_ERROR, {
        uri: uri,
        info: info
    });
}
//# sourceMappingURL=errors.js.map
