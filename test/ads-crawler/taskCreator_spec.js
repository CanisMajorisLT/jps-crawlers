import { expect } from 'chai'
import taskCreator from '../../src/crawlers/lib/api/taskCreator';


describe('taskCreator', () =>{

    function getFakeUriGenerator(returnsPromises, globalData = {}, throwError = false, throwErrorInPromise = false) {
        return async function () {
             function* gen() {
                let i = 10;
                while (i--) {

                    if (throwError && Math.random() > 0.5) {
                        throw Error('TEST ERROR!')
                    }

                    const o = {
                        local: {
                            getHtml: i
                        },
                        global: globalData
                    };
                    if (returnsPromises) {
                        if (throwErrorInPromise && Math.random() > 0.5) {
                            yield Promise.reject(Error('TEST ERROR ASYNC'));
                        } else {
                            yield Promise.resolve(o);
                        }
                    } else {
                        yield o
                    }
                }
            }

            return gen();
        }
    }

    describe('takes two params, an async function, that returns generator and an object with task options', () =>{

        it('returns async function, which pushes tasks to given observer', (done) =>{
            let isDone = false;

            function* testObserver() {
                try {
                    let i = -1;
                    while (true) {
                        i++;
                        const val = yield;
                        expect(val).to.exist;
                    }
                } catch(e) {
                    done(e);
                    isDone = true;
                } finally {
                    !isDone && done();
                }
            }

            const tc = taskCreator(getFakeUriGenerator(), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('works when 1st param, async function returns generator, which returns PLAIN objects with uri', (done) =>{
            let isDone = false;
            function* testObserver() {
                try {
                    while (true) {
                        const val = yield;

                        expect(val).to.have.property('local');
                        expect(val).to.have.property('global');
                        expect(val.local.crawlDetails).to.have.property('config');
                        expect(val.local.crawlDetails).to.have.property('getHtml')
                    }
                } catch(e) {
                    done(e);
                    isDone = true;
                } finally {
                    !isDone && done();
                }
            }

            const tc = taskCreator(getFakeUriGenerator(), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('works when 1st param, async function returns generator, which returns PROMISES that resolve to objects with uri', (done) =>{
            let isDone = false;
            function* testObserver() {
                try {
                    let i = 10;
                    while (true) {
                        i--;
                        const val = yield;

                        expect(val).to.have.property('local');
                        expect(val).to.have.property('global');
                        expect(val.local.crawlDetails).to.have.property('getHtml');
                    }
                } catch(e) {
                    done(e);
                    isDone = true;
                } finally {
                    !isDone && done();
                }
            }

            const tc = taskCreator(getFakeUriGenerator(true), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('cleans up flow objects local data, and adds tasks specs to it, while keep remaining object intact', (done) =>{
            let isDone = false;

            const testGlobalData = {
                crawls: {
                    data: 'TEST'
                }
            };

            function* testObserver() {
                try {
                    let i = 10;
                    while (true) {
                        i--;
                        const val = yield;

                        // local object replaced
                        expect(val.local.uri).to.be.undefined;
                        expect(val.local.crawlDetails).to.have.property('getHtml');

                        // global intact
                        expect(val.global).to.deep.equal(testGlobalData);
                    }
                } catch(e) {
                    done(e);
                    isDone = true;
                } finally {
                    !isDone && done();
                }
            }

            const tc = taskCreator(getFakeUriGenerator(false, testGlobalData), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('handles errors thrown by iterator generator', (done) =>{
            function* testObserver() {
                try {
                    while (true) {
                        yield;
                    }
                } finally {
                }
            }

            const tc = taskCreator(getFakeUriGenerator(false, {}, true), {});
            const ob = testObserver();
            ob.next(); // init observer


            async function testThrowing() {
                try {
                    await tc(ob);
                } catch (e) {
                    expect(()=> {throw e}).to.throw(/TEST ERROR/);
                    done()
                }
            }

            testThrowing();
        });


        it('ignores errors thrown by iterator generator in yielded promises', (done) =>{
            function* testObserver() {
                try {
                    while (true) {
                        // it simply gets called by these result where promised resolved
                        const val = yield;
                        expect(val).to.have.property('local');
                        expect(val).to.have.property('global');

                    }
                } finally {
                    done()
                }
            }

            const tc = taskCreator(getFakeUriGenerator(true, {}, false, true), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });
    });
});