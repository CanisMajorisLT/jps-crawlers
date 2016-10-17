
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
        if (task.requeue && task.requeue > 0 && (task.timesRequeued < task.requeue)) {
            ++task.timesRequeued;

            queue.push(task)
        } else {
            //logger.debug('Task failed too many times, all requeues exausted');
            callback && callback({error, task});
        }
    }

    return {
        handler: handleTaskFailure,
        setQueue: (q)=> {queue = q}
    }
}