import chai, { expect } from 'chai'
import spies from 'chai-spies'
import queue from 'async/queue'
import { queueWorkerFactory } from '../../src/crawlers/lib/api/parse-task-consumer/queueWorker'

chai.use(spies);

describe('queueWorkerFactory', () => {
    it('takes a task consumer, success and fail callbacks and returns a WORKER fnc, which is provided to async.queue', (done) => {
        function consumer(task) {
            try {
                expect(task).to.deep.equal({name: 'TASK'});
                done();
            } catch (e) {
                done(e);
            }

        }

        const worker = queueWorkerFactory(consumer, () => {}, () => {});
        const q = queue(worker, 1);

        q.push({name: 'TASK'});

    });

    describe('worker', () => {
        it('if provided task has delay, it sleeps for delay before giving task to consumer', (done) => {
            let start;

            function consumer() {
                try {
                    expect(Date.now() - start).to.be.within(98, 102);
                    done();
                } catch (e) {
                    done(e);
                }
            }

            const worker = queueWorkerFactory(consumer, () => {}, () => {});
            const q = queue(worker, 1);

            start = Date.now();
            q.push({
                delay: 100
            });
        });

        it('if task has retries, then it wraps task consumer in retry function for this task', (done) => {
            let tries = 0;

            function consumer() {
                tries++;
                return Promise.reject();
            }

            function failHandler() {
                try {
                    expect(tries).to.equal(3);
                    done();
                } catch (e) {
                    done(e);
                }
            }

            const worker = queueWorkerFactory(consumer, failHandler, () => {});
            const q = queue(worker, 1);

            q.push({
                retry: 3
            });
        });

        it('if task has no retries, then task is simply given to consumer fnc', (done) => {
            let tries = 0;

            function consumer() {
                tries++;
                return Promise.reject();
            }

            function failHandler() {
                try {
                    expect(tries).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            }

            const worker = queueWorkerFactory(consumer, failHandler, () => {});
            const q = queue(worker, 1);

            q.push({});
        });

        it('if task successfully completes, success callback is called', (done) => {
            function consumer() {
                return Promise.resolve('RESULT');
            }

            function failHandler() {
                // not called
            }

            function successHandler(successObj) {
                try {
                    expect(successObj.success).to.be.true;
                    expect(successObj.task).to.deep.equal({name: 'TEST_TASK'});
                    expect(successObj.result).to.equal('RESULT');
                    done();
                } catch (e) {
                    done(e);
                }
            }

            const worker = queueWorkerFactory(consumer, failHandler, successHandler);
            const q = queue(worker, 1);

            q.push({name: 'TEST_TASK'});
        });

        it('if task failed (promise reject) failure callback is called', (done) => {
            function consumer() {
                return Promise.reject(Error('REJECT_RESULT'));
            }

            function failHandler(failureObj) {
                try {
                    expect(failureObj.success).to.be.false;
                    expect(failureObj.task).to.deep.equal({name: 'TEST_TASK'});
                    expect(failureObj.error).to.deep.equal(Error('REJECT_RESULT'));
                    done();
                } catch (e) {
                    done(e);
                }
            }

            function successHandler(successObj) {
                // not called
            }

            const worker = queueWorkerFactory(consumer, failHandler, successHandler);
            const q = queue(worker, 1);

            q.push({name: 'TEST_TASK'});
        });

        it('after task is done (success or fail), it calls callback to indicate that its done', (done) => {


            const spy = chai.spy();

            function testWrapper(worker) {
                return function(task, callback) {
                    return worker(task, ()=> {
                        spy();
                        try {
                            expect(spy).to.have.been.called.once;
                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                }
            }

            function consumer() {
                return Promise.resolve();
            }

            function failHandler(failureObj) {}

            function successHandler(successObj) {}

            const worker = testWrapper(queueWorkerFactory(consumer, failHandler, successHandler));
            const q = queue(worker, 1);

            q.push();

        });
    });


});
