import { default as async_ } from 'async'
import { extractTotalPageCount, extractFrontInfo } from './parser'
import { queueWorkerFactory } from '../common/queueWorkerFactory'
import { generateFrontInfoTasks, getNumberOfFrontPages,
    parseFrontPageArticlesFactory, handleTaskSuccessFacory, handleTaskFailureFactory } from '../common/core'

const FRONT_PAGE_URI = 'http://www.cvonline.lt/darbo-skelbimai/visi?page=${page}';
const DEFAULT_WORKERS_NUMBER = 1;


async function parseCVO() {

    let handleTaskFail = handleTaskFailureFactory('CVO');
    const handleTaskSuccess = handleTaskSuccessFacory('CVO');
    const adsParser = parseFrontPageArticlesFactory(FRONT_PAGE_URI, extractFrontInfo);

    const worker = queueWorkerFactory(adsParser, handleTaskFail.handler, handleTaskSuccess);
    const FrontInfoFetchingQueue = async_.queue(worker, DEFAULT_WORKERS_NUMBER);

    handleTaskFail.setQueue(FrontInfoFetchingQueue); // so task can be requeued on fail

    const pages = await getNumberOfFrontPages(FRONT_PAGE_URI.replace('${page}', '200'), extractTotalPageCount);
    console.log(`Page count: ${pages}`);

    const tasks = generateFrontInfoTasks(pages, 1);

    FrontInfoFetchingQueue.push(tasks)
}

export default parseCVO





