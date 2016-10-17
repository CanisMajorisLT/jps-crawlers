import chai, { expect } from 'chai'
import spies from 'chai-spies'
import queue from 'async/queue'

import { applyParserToTaskHtmlFactory, handleTaskFailureFactory } from '../../src/crawlers/lib/api/parse-task-consumer/taskConsumer'

chai.use(spies);

describe.only('taskConsumer', () =>{
    describe('applyParserToTaskHtmlFactory', () =>{
        it('takes a parser fnc and returns fnc, which is supplied as task consumer to the worker', () =>{
            const consumer = applyParserToTaskHtmlFactory(() => {});
            expect(consumer).to.be.a('function')
        });

        it('returned consumer fnc take task argument and awaits for html from task and then provides html together with task to consumer', () =>{
            const parserSpy = chai.spy();
            const consumer = applyParserToTaskHtmlFactory(parserSpy);

            const task = {
                getHtml() {
                    return Promise.resolve('TEST');
                }
            };

            return consumer(task)
                .then(() => {
                    expect(parserSpy).to.have.been.called.once.with('TEST');
                })

        });
    });

    describe('handleTaskFailureFactory', () =>{
        it('pushes failed task back to queue if task has retries left', (done) =>{
            var queueSpy = chai.spy();
            const failureHandler = handleTaskFailureFactory();
            function queue() {

                return {
                    push(task) {
                        queueSpy();

                        if (task.timesRequeued === 5) {
                            try {
                                expect(queueSpy).to.have.been.called.exactly(5);
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }

                        failureHandler.handler({task});
                    }
                };
            }


            failureHandler.setQueue(queue());
            failureHandler.handler({error: 'TEST_ERROR', task: {name: 'TEST', requeue: 5, timesRequeued: 0}});
        });

        it('invokes callback if all task retries were used (task failled)', () =>{
            function spyCallback(data) {
                expect(data.error).to.equal('TEST_ERROR');
                expect(data.task).to.deep.equal({name: 'TEST', requeue: 5, timesRequeued: 5});
            }
            const failureHandler = handleTaskFailureFactory(spyCallback);

            function queue() {
                return {
                    push(task) {
                        failureHandler.handler({error: 'TEST_ERROR', task});
                    }
                };
            }


            failureHandler.setQueue(queue());
            failureHandler.handler({error: 'TEST_ERROR', task: {name: 'TEST', requeue: 5, timesRequeued: 0}});
        });
    });
});