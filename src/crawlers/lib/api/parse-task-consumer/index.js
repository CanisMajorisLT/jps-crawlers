import queue from 'async/queue'
import { coroutine } from '../utils'
import { queueWorkerFactory } from './queueWorker'
import { applyParserToTaskHtmlFactory, handleTaskFailureFactory } from './taskConsumer'

const DEFAULT_WORKERS_NUMBER = 1;

function getTaskReceiver(consumer, callBack) {
    return function* taskReceiver() {
        try {
            while (true) {
                const task = yield;
                consumer(task);
            }
        } finally {
            callBack();
        }
    }
}

export default function getConsumer(parser) {

    return base => next => taskGenerator => {

        next((successObserver, failureObserver)=> {
            // worker callbacks
            const handleTaskFail = handleTaskFailureFactory((taskFailResult)=> failureObserver && failureObserver.next(taskFailResult));
            const handleTaskSuccess = (taskResult)=> successObserver && successObserver.next(taskResult);

            const worker = queueWorkerFactory(applyParserToTaskHtmlFactory(parser), handleTaskSuccess, handleTaskFail.handler);
            const queue = queue(worker, DEFAULT_WORKERS_NUMBER);

            handleTaskFail.setQueue(queue); // so task can be requeued on fail

            // this will push flow data object with tasks in local data
            // to que whenever they are generated and will go next when all done
            const taskConsumer = coroutine(getTaskReceiver)((task) => queue.push(task), () => {
                successObserver && successObserver.return();
                failureObserver && failureObserver.return();
            });

            taskGenerator(taskConsumer);
        });
    };
}