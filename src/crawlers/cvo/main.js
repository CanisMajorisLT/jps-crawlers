import { getPageBody } from '../common/scrape'
import { default as async_ } from 'async'
import { extractTotalPageCount, extractFrontInfo } from './parser'
import { datePlusHours } from '../common/utils'
import { queueWorkerFactory } from '../common/queueWorkerFactory'

const FRONT_PAGE_URI = 'http://www.cvonline.lt/darbo-skelbimai/visi?page=${page}';
const DEFAULT_WORKERS_NUMBER = 1;
const DEFAULT_TASK_DELAY = 1000;
const DEFAULT_TASK_REQUEUE = 5;
const DEFAULT_TASK_RETRY = 3;
const DEFAULT_TASK_RETRY_INTERVAL = 200;


/**
 * Generates object used for doing parse task
 * @param pageNumber
 * @returns {{pageNumber: *, expires: *, requeue: number, timesRequeued: number, retry: number, retryInterval: number, delay: number}}
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
    for (var i = 0; i <= n; i++) {
        tasks.push(generateFrontInfoTask(i))
    }

    return tasks
}

/**
 * Parses page further enough that it has no ads, but link to last page with ads
 * and thus returns total number of pages with ads.
 * @returns {Number}
 */
async function getNumberOfFrontPages() {
    try {
        let html = await getPageBody(FRONT_PAGE_URI.replace('${page}', '200'));
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
    const pageNumber = task.pageNumber;
    const uri = FRONT_PAGE_URI.replace('${page}', pageNumber);
    const html = await getPageBody(uri);

    return extractFrontInfo(html);


}


function handleTaskSuccess({result: result, task: task}) {
    console.log(`Successfully finished parsing front page nr ${task.pageNumber}`);
    console.log(result);
    // write to DB, pass down for metadata add
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



async function parseCVO() {
    let handleTaskFail = handleTaskFailureWrapper();

    const worker = queueWorkerFactory(parseFrontPage, handleTaskFail.handler, handleTaskSuccess);
    const FrontInfoFetchingQueue = async_.queue(worker, DEFAULT_WORKERS_NUMBER);

    handleTaskFail.setQueue(FrontInfoFetchingQueue); // so task can be requeued on fail

    const pages = await getNumberOfFrontPages();
    console.log(`Page count: ${pages}`);

    const tasks = generateManyFrontInfoTasks(pages);

    FrontInfoFetchingQueue.push(tasks)
}

parseCVO();


