import { asyncRetry, sleep, coroutine } from '../../src/crawlers/lib/api/utils'
import { expect } from 'chai'

describe('utils', () =>{
    describe('asyncRetry', () =>{
        it('wraps a given function in a function, which returns a promise', () =>{
            const retryFnc = asyncRetry(()=> new Promise((resolve, reject)=> setTimeout(resolve, 1)), 1);
            expect(retryFnc()).to.be.a('promise');
        });

        it('retires failed function (promise reject) provided amount of times, with provided interval', () =>{
            const RETRY = 5;
            const RETRY_INTERVAL = 5;
            let timesCalled = 0;

            const retryFnc = asyncRetry(()=> {
                timesCalled++;
                return new Promise((resolve, reject)=> setTimeout(timesCalled === 5 ? resolve : reject, 1));
            }, RETRY, RETRY_INTERVAL);

            return retryFnc()
                .then((e)=> {
                    expect(e).to.be.undefined;
                    expect(timesCalled).to.equal(RETRY);
                });
        });

        it('if function failed more then retry count its reject result is returned (by reject)', () =>{
            const RETRY = 5;
            const RETRY_INTERVAL = 5;

            const retryFnc = asyncRetry(()=> {
                return new Promise((resolve, reject)=> setTimeout(reject, 1));
            }, RETRY, RETRY_INTERVAL);

            return retryFnc()
                .catch((e)=> {
                    expect(e).to.be.undefined;
                });
        });

        it('if function succeeds then promise is resolved with that result', () =>{
            const RETRY = 5;
            const RETRY_INTERVAL = 5;

            const retryFnc = asyncRetry(()=> {
                return new Promise((resolve, reject)=> setTimeout(()=> resolve('SUCCESS'), 1));
            }, RETRY, RETRY_INTERVAL);

            return retryFnc()
                .then((e)=> {
                    expect(e).to.be.equal('SUCCESS');
                });
        });
    });

    describe('sleep', () =>{
        it('return a promise that resolves after given amount of time', () =>{
            const start = Date.now();
            return sleep(50)
                .then(()=> expect(Date.now() - start).to.be.within(48, 52));
        });
    });
    
    describe('coroutine', () =>{
        it('returns a function, which when executed initializes observer generetor and returns it', () =>{
            function* testObserver(cb) {
                cb(yield);
            }

            const test = (v) => expect(v).to.equal(1);
            const t = coroutine(testObserver)(test);

            t.next(1);
        });
    });
});