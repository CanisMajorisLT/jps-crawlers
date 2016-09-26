import { expect } from 'chai'
import taskCreator from '../../src/crawlers/lib/api/taskCreator';


describe.only('taskCreator', () =>{

    function getFakeUriGenerator(returnsPromises) {
        return async function () {
             function* gen() {
                let i = 10;
                while (i--) {
                    const o = {
                        local: {
                            uri: i
                        }
                    };
                    if (returnsPromises) {
                        yield Promise.resolve(o)
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

            // TODO rethink this test
            function* testObserver() {
                try {
                    let i = -1;
                    while (true) {
                        i++;
                        const val = yield;
                        expect(val).to.exist;
                    }
                } finally {
                    done()
                }
            }

            const tc = taskCreator(getFakeUriGenerator(), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('works when 1st param, async function returns generator, which returns PLAIN objects with uri', (done) =>{
            function* testObserver() {
                try {
                    let i = 10;
                    while (true) {
                        i--;
                        const val = yield;
                        expect(val).to.have.property('pageUri').that.equals(i);
                    }
                } finally {
                    done()
                }
            }

            const tc = taskCreator(getFakeUriGenerator(), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('works when 1st param, async function returns generator, which returns PROMISES that resolve to objects with uri', (done) =>{
            function* testObserver() {
                try {
                    let i = 10;
                    while (true) {
                        i--;
                        const val = yield;
                        expect(val).to.have.property('pageUri').that.equals(i);
                    }
                } finally {
                    done()
                }
            }

            const tc = taskCreator(getFakeUriGenerator(true), {});
            const ob = testObserver();
            ob.next(); // init observer
            tc(ob);
        });

        it('cleans up flow objects local data, and adds tasks specs to it, while keep remaining object intact', () =>{

        });
    });
});