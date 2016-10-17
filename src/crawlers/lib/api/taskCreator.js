import { datePlusHours } from './utils'

const DEFAULT_TASK_DELAY = 1000;
const DEFAULT_TASK_REQUEUE = 5;
const DEFAULT_TASK_RETRY = 3;
const DEFAULT_TASK_RETRY_INTERVAL = 200;

const defaultConfig = {
    DEFAULT_TASK_DELAY,
    DEFAULT_TASK_REQUEUE,
    DEFAULT_TASK_RETRY,
    DEFAULT_TASK_RETRY_INTERVAL
};


/**
 * let newTaskModel = {
    local: {
        crawlDetails: {
            config: {
                expires: datePlusHours(1),
                requeue: config.DEFAULT_TASK_REQUEUE, // optional
                timesRequeued: 0, // optional
                retry: config.DEFAULT_TASK_RETRY, // optional
                retryInterval: config.DEFAULT_TASK_RETRY_INTERVAL, // optional
                delay: config.DEFAULT_TASK_DELAY, //optional
            },
            pageUri, // TODO maybe this should be a function that returns a url. promise(url)
            isLastPage
        },
    },
    global: {
        crawls: []
    }
};
 * Generates object used for doing parse task
 * @param {object} data
 * @param {object=} conf
 */
function generateFrontInfoTask(data, conf = defaultConfig) {
    const config =  {
        expires: datePlusHours(1),
        requeue: conf.DEFAULT_TASK_REQUEUE, // optional
        timesRequeued: 0, // optional
        retry: conf.DEFAULT_TASK_RETRY, // optional
        retryInterval: conf.DEFAULT_TASK_RETRY_INTERVAL, // optional
        delay: conf.DEFAULT_TASK_DELAY, //optional
    };

    return Object.assign({}, data, {config});
}


// returns a function that accepts generator observer and pushes tasks into it
export default function(getHtmlGenerator, options) {

    return async function(consumerObserver)  {
        const pagesGen = await getHtmlGenerator();
        try {
            for (let data of pagesGen) {
                let p;
                if (data.then) {
                    try {
                        p = await data;
                    } catch (err) {
                        console.error('Caught error in iterator generator promise, continue program');
                        continue;
                    }
                } else {
                    p = data;
                }

                if (p.local.getHtml === undefined) throw Error('Pages iterator must have .getHtml() that returns a promise');

                p.local = {
                    crawlDetails: generateFrontInfoTask(p.local, options)
                };



                consumerObserver.next(p)
            }
        } catch (error) {
            throw Error('Unhandled error has been caught, TODO implement handling. ' + error)
        }

        return consumerObserver.return();
    }
}