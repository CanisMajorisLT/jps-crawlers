import { default as async_ } from 'async'
import { extractTotalPageCount, extractFrontInfo } from './parser'
import { queueWorkerFactory } from '../common/queueWorkerFactory'
import { generateFrontInfoTasks, getNumberOfFrontPages,
         parseFrontPageArticlesFactory, handleTaskSuccessFactory, handleTaskFailureFactory } from '../common/core'
import logger from '../../../logging/logger'

const FRONT_PAGE_URI = 'http://www.cvbankas.lt/?page=${page}';
const DEFAULT_WORKERS_NUMBER = 1;


async function parseCVB(taskSuccessHandler, config, onDone) {

    let handleTaskFail = handleTaskFailureFactory('CVB');
    const handleTaskSuccess = handleTaskSuccessFactory('CVB', taskSuccessHandler);
    const adsParser = parseFrontPageArticlesFactory(FRONT_PAGE_URI, extractFrontInfo);

    const worker = queueWorkerFactory(adsParser, handleTaskFail.handler, handleTaskSuccess);
    const FrontInfoFetchingQueue = async_.queue(worker, config.general.workers || DEFAULT_WORKERS_NUMBER);
    if(onDone !== undefined) FrontInfoFetchingQueue.drain = onDone;


    handleTaskFail.setQueue(FrontInfoFetchingQueue); // so task can be requeued on fail

    const pages = await getNumberOfFrontPages(FRONT_PAGE_URI.replace('${page}', '1'), extractTotalPageCount);
    logger.info(`Page count: ${pages}`);

    const tasks = generateFrontInfoTasks(pages, 1, config.task);

    FrontInfoFetchingQueue.push(tasks)
}

export default parseCVB


