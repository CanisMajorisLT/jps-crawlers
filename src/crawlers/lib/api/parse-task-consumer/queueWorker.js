import { sleep, asyncRetry } from '../utils'

export function queueWorkerFactory(taskConsumer, taskFailureCallback, taskSuccessCallback) {

    return async function worker(task, callback) {
        let result;

        try {
            if (task.delay) await sleep(task.delay);

            if (task.retry) {
                result = await asyncRetry(taskConsumer, task.retry, task.retryInterval)(task)
            } else {
                result = await taskConsumer(task);
            }

            taskSuccessCallback({
                success: true,
                task,
                result
            })
        } catch (error) {
            taskFailureCallback({
                success: false,
                task,
                error
            })
        } finally {
            callback()
        }
    }
}
