import { sleep, asyncRetry } from '../utils'


export function addResultToTask(task, result) {
    if (!task.global.crawls) {
        task.global.crawls = []
    }

    task.global.crawls.push(result);
    return task;
}

export function queueWorkerFactory(taskConsumer, taskFailureCallback, taskSuccessCallback) {

    return async function worker(task, callback) {
        const crawlDetails = task.local.crawlDetails;
        let result;

        try {
            if (task.delay) await sleep(crawlDetails.config.delay);

            if (task.retry) {
                result = await asyncRetry(taskConsumer, crawlDetails.config.retry, crawlDetails.config.retryInterval)(crawlDetails)
            } else {
                result = await taskConsumer(crawlDetails);
            }


            taskSuccessCallback(addResultToTask(task, result));
        } catch (error) {
            taskFailureCallback({
                task,
                error
            });
        } finally {
            callback();
        }
    }
}
