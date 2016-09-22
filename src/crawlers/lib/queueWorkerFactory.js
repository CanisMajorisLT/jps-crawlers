function sleep(ms) {
    return new Promise((resolve)=> {
        setTimeout(resolve, ms)
    })
}

function asyncRetry(fnc, times, delay = 100) { //TODO test
    return function() {
        const args = arguments;
        const that = this;
        let failed = 0;

        return new Promise((resolve, reject)=> {
            function runSingleTry() {
                fnc.apply(that, args)
                    .then(r=> resolve(r))
                    .catch((e)=> {
                        ++failed;

                        if (failed < times) setTimeout(runSingleTry, delay);
                        else reject(e)
                    })
            }

            runSingleTry()
        })
    }
}

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