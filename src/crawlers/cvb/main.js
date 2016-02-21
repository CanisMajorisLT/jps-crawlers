import scrape from '../common/scrape'
import { default as async_ } from 'async'
import { extractTotalPageCount, extractFrontInfo } from './parser'
import { datePlusHours } from '../common/utils'
import { queueWorkerFactory } from '../common/queueWorkerFactory'

const FRONT_PAGE_URI = 'http://www.cvbankas.lt/?page=${page}';
const DEFAULT_WOKRERS_NUMBER = 1;
const DEFAULT_TASK_DELAY = 1000;
const DEFAULT_TASK_REQUEUE = 5;
const DEFAULT_TASK_RETRY = 3;
const DEFAULT_TASK_RETRY_INTERVAL = 200;


/**
 * Generates object used for doing parse task
 * @param pageNumber
 * @param delayBeforeRun
 * @returns {{pageNumber: *, expires: *, requeue: boolean, timesRequeued: number, retry: number, retryInterval: number, delay: number}}
 */
function generateFrontInfoTask(pageNumber) {
    return {
        pageNumber,
        expires: datePlusHours(1),
        requeue: DEFAULT_TASK_REQUEUE, // optional
        timesRequeued: 0, // optional
        retry: DEFAULT_TASK_RETRY, // optional
        retryInterval: DEFAULT_TASK_RETRY_INTERVAL, // optional
        delay: DEFAULT_TASK_DELAY //optional
    }
}

function generateManyFrontInfoTasks(n) {
    const tasks = [];
    for (var i = 1; i <= n; i++) {
        tasks.push(generateFrontInfoTask(i))
    }

    return tasks
}

/**
 * Parses first page to fetch a number of total pages with ads
 * @returns {Number}
 */
async function getNumberOfFrontPages() {
    try {
        let html = await scrape.getPageBody(FRONT_PAGE_URI.replace('${page}', '1'));
        return parseInt(extractTotalPageCount(html));
    } catch (error) {
        console.log('getNumberOfFrontPages threw error', error);
    }
}

/**
 * Parses given page n to extract all info about ads.
 * Used as task in queue worker
 * @param task
 * @returns {*}
 */
async function parseFrontPage(task) {
    throw new Error('test');
    const pageNumber = task.pageNumber;
    const uri = FRONT_PAGE_URI.replace('${page}', pageNumber);
    const html = await scrape.getPageBody(uri);

    return extractFrontInfo(html);


}


function handleTaskSuccess({result: result, task: task}) {
    console.log(`Successfully finished parsing front page nr ${task.pageNumber}`);
}


function handleTaskFailureWrapper() {
    let queue;

    function handleTaskFailure({error: error, task: task}) {
        console.error('Task failed', error, task);
        if (task.requeue && task.requeue > 0 && (task.timesRequeued < task.requeue)) {
            ++task.timesRequeued;

            queue.push(task)
        } else {
            // log error so somethere
        }
    }

    return {
        handler: handleTaskFailure,
        setQueue: (q)=> {queue = q}
    }
}



async function parseCVB() {
    let handleTaskFail = handleTaskFailureWrapper();

    const worker = queueWorkerFactory(parseFrontPage, handleTaskFail.handler, handleTaskSuccess);
    const FrontInfoFetchingQueue = async_.queue(worker, DEFAULT_WOKRERS_NUMBER);

    handleTaskFail.setQueue(FrontInfoFetchingQueue); // so task can be requeued on fail

    const pages = await getNumberOfFrontPages();
    const tasks = generateManyFrontInfoTasks(pages);

    FrontInfoFetchingQueue.push(tasks)
}

parseCVB();


