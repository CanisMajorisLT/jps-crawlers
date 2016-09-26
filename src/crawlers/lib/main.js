import { getPageBody } from './scrape'
import { datePlusHours } from './utils'
import logger from '../../../logging/logger'

const DEFAULT_TASK_DELAY = 1000;
const DEFAULT_TASK_REQUEUE = 5;
const DEFAULT_TASK_RETRY = 3;
const DEFAULT_TASK_RETRY_INTERVAL = 200;

const defaultConfig = {
    DEFAULT_TASK_DELAY,
    DEFAULT_TASK_REQUEUE,
    DEFAULT_TASK_RETRY,
    DEFAULT_TASK_RETRY_INTERVAL
};


/**
 * Generates object used for doing parse task
 * @param pageNumber
 * @param {boolean} isLastPage
 * @param {object=} config
 * @returns {{pageNumber: *, expires: *, requeue: number, timesRequeued: number, retry: number, retryInterval: number, delay: number}}
 */
function generateFrontInfoTask(pageNumber, isLastPage, config = defaultConfig) {
    return {
        pageNumber,
        expires: datePlusHours(1),
        requeue: config.DEFAULT_TASK_REQUEUE, // optional
        timesRequeued: 0, // optional
        retry: config.DEFAULT_TASK_RETRY, // optional
        retryInterval: config.DEFAULT_TASK_RETRY_INTERVAL, // optional
        delay: config.DEFAULT_TASK_DELAY, //optional
        isLastPage
    }
}

/**
 * Generates n number of tasks for worker
 * @param {number} n
 * @param {number=0} startIndex
 * @param {object} config
 * @returns {Array}
 */
export function generateFrontInfoTasks(n, startIndex = 0, config) {
    const tasks = [];
    for (var i = startIndex; i <= n; i++) {
        tasks.push(generateFrontInfoTask(i, i === n, config))
    }

    return tasks
}

/**
 * Parses given uri with provided parser to get number of pages to parse
 * @param {string} uri
 * @param {function} parser
 * @returns {Number}
 */
export async function getNumberOfFrontPages(uri, parser) {
    try {
        let html = await getPageBody(uri);
        return parseInt(parser(html));
    } catch (error) {
        logger.error('getNumberOfFrontPages threw error', error);
    }
}

/**
 * Parses given page to extract all info about ads.
 * Used as task in queue worker.
 * @param {string} uri
 * @param {function} parser
 * @returns {function} parseFrontPage
 */
export function parseFrontPageArticlesFactory(uri, parser) {

    return async function parseFrontPage(task) {
        const fullUri = uri.replace('${page}', task.pageNumber); // TODO use await as well so i can be fnc that does anything need to get page
        const html = await getPageBody(fullUri);

        return parser(html, task);
    }
}

export function handleTaskSuccessFactory(site, callback) {
    return function handleTaskSuccess({result: result, task: task}) {
        logger.info(`${site} Successfully finished parsing front page nr ${task.pageNumber}`);

        // write to DB
        callback && callback(result, site, task)
    }
}




export function handleTaskFailureFactory(site) {
    let queue;

    function handleTaskFailure({error: error, task: task}) {
        logger.error(`${site} Task failed`, {error, task});
        if (task.requeue && task.requeue > 0 && (task.timesRequeued < task.requeue)) {
            ++task.timesRequeued;

            queue.push(task)
        } else {
            logger.debug('Task failed too many times, all requeues exausted');
        }
    }

    return {
        handler: handleTaskFailure,
        setQueue: (q)=> {queue = q}
    }
}



