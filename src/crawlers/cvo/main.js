import { default as async_ } from 'async'
import { extractTotalPageCount, extractFrontInfo } from './parser'
import { queueWorkerFactory } from '../common/queueWorkerFactory'
import { generateFrontInfoTasks, getNumberOfFrontPages,
    parseFrontPageArticlesFactory, handleTaskSuccessFactory, handleTaskFailureFactory } from '../common/core'

const FRONT_PAGE_URI = 'http://www.cvonline.lt/darbo-skelbimai/visi?page=${page}';
const DEFAULT_WORKERS_NUMBER = 1;


async function parseCVO(taskSuccessHandler, taskConfig, onDone) {

    let handleTaskFail = handleTaskFailureFactory('CVO');
    const handleTaskSuccess = handleTaskSuccessFactory('CVO', taskSuccessHandler);
    const adsParser = parseFrontPageArticlesFactory(FRONT_PAGE_URI, extractFrontInfo);

    const worker = queueWorkerFactory(adsParser, handleTaskFail.handler, handleTaskSuccess);
    const FrontInfoFetchingQueue = async_.queue(worker, DEFAULT_WORKERS_NUMBER);
    if(onDone !== undefined) FrontInfoFetchingQueue.drain = onDone;

    handleTaskFail.setQueue(FrontInfoFetchingQueue); // so task can be requeued on fail

    const pages = await getNumberOfFrontPages(FRONT_PAGE_URI.replace('${page}', '200'), extractTotalPageCount);
    console.log(`Page count: ${pages}`);

    const tasks = generateFrontInfoTasks(pages, 1, taskConfig);

    FrontInfoFetchingQueue.push(tasks)
}

export default parseCVO





