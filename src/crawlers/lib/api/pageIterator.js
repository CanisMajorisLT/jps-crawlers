import { isPlainObject, isFunction } from 'lodash'
import logger from '../../../../logging/logger'
import { getPageBody } from './scrape'
import getTaskCreator from './taskCreator'
import { createFlowObject } from './utils'


/**
 * Parses given uri with provided parser to get number of pages to parse
 * @param {string} uri
 * @param {function} parser
 * @returns {Number}
 */
export async function getNumberOfPages(uri, parser) {
    try {
        let html = await getPageBody(uri);
        return parseInt(parser(html));
    } catch (error) {
        logger.error('getNumberOfFrontPages threw error', error);
        process.exit(1);
    }
}

/**
 * Takes basic options for getting count of pages to parse and returns generator that yields functions, which return promises
 * that resolve to html to parse
 * @param {string} pageCountUrl
 * @param {function} parser
 * @param {number} startIndex
 * @param {string} iterateUrl must have a ${page} placeholder, which will be replaced with number
 * @returns {pagesGenerator}
 */
export async function getNumOfPagesGen({pageCountUrl, parser, startIndex, iterateUrl}) {
    const pagesCount = await getNumberOfPages(pageCountUrl, parser);

    function getHtmlFactory(uri) {
        return async function getHtml() {
            return await getPageBody(uri);
        }
    }

    function* pagesGenerator() {
        for (let i = startIndex || 0; i <= pagesCount; i++) {

            yield createFlowObject({getHtml: getHtmlFactory(iterateUrl.replace('${page}', i))});
        }
    }

    return pagesGenerator();
}


/**
 * Takes a function which when executed must return a generator, which yields promises, that resolve to html to be parsed + any
 * other data (maybe its not first generator, so then it also ads data of previous parse)
 * As default can also take an object:
 *  { // for generic pages
        pageCountUrl: 'http://www.cvbankas.lt/?page=1',
        extractCount: (html) => {return 100},
        iterateUrl: 'http://www.cvbankas.lt/?page=${page}'
    }
 */
export function iterator(objOrFnc) {
    if (isPlainObject(objOrFnc)) {
        
        return core => next => data => next(getTaskCreator(()=> getNumOfPagesGen(objOrFnc), core.options)); // returns a task creator, which
    } else if (isFunction(objOrFnc)) {

        return core => next => data => next(getTaskCreator(()=> objOrFnc(core, next, data), core.options));
    } else {
        
        throw Error('Provided argument must be either function or object, read the docs for more info.')
    }
}