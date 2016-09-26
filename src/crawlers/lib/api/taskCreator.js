import { datePlusHours } from './utils'

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
 * @param pageUri
 * @param {boolean} isLastPage
 * @param {object=} config
 * @returns {{pageNumber: *, expires: *, requeue: number, timesRequeued: number, retry: number, retryInterval: number, delay: number}}
 */
function generateFrontInfoTask(pageUri, isLastPage, config = defaultConfig) {
    return {
        pageUri, // TODO maybe this should be a function that returns a url. promise(url)
        expires: datePlusHours(1),
        requeue: config.DEFAULT_TASK_REQUEUE, // optional
        timesRequeued: 0, // optional
        retry: config.DEFAULT_TASK_RETRY, // optional
        retryInterval: config.DEFAULT_TASK_RETRY_INTERVAL, // optional
        delay: config.DEFAULT_TASK_DELAY, //optional
        isLastPage
    }
}

// returns a function that accepts generator observer and pushes tasks into it
export default function(getNumOfPagesGen, options) {
    // TODO test

    return async function(consumerObserver)  {
        const pagesGen = await getNumOfPagesGen();
        let pageUri;
        for (let page of pagesGen) {
            if (page.then) {
                let p = await page;
                pageUri = p.local.uri;
            } else {
                pageUri = page.local.uri
            }

            consumerObserver.next(generateFrontInfoTask(pageUri, 'TODO', options))
        }
        consumerObserver.return();
    }
}