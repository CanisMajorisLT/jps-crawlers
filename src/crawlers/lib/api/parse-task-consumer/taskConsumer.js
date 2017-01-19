
/**
 * Parses given page to extract all info about ads.
 * Used as task in queue worker.
 * @param {function} parser
 * @returns {function} applyParserToTaskHtml
 */
export function applyParserToTaskHtmlFactory(parser) {

    return async function applyParserToTaskHtml(task) {
        const html = await task.getHtml();

        return parser(html, task);
    }
}


export function handleTaskFailureFactory(callback) {
    let queue;
    // TODO prefix logging by crawler name
    function handleTaskFailure({error, task}) {
        //logger.error(`Task failed`, {error, task});

        const config = task.local.crawlDetails.config;

        if (config.requeue && config.requeue > 0 && (config.timesRequeued < config.requeue)) {
            ++config.timesRequeued;

            queue.push(task)
        } else {
            //logger.debug('Task failed too many times, all requeues exausted');
            if (!task.global.crawlErrors) {
                task.global.crawlErrors = [];
            }

            task.global.crawlErrors.push(error);

            callback && callback(task);
        }
    }

    return {
        handler: handleTaskFailure,
        setQueue: (q)=> {queue = q}
    }
}