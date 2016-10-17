const HOUR = 1000 * 60 * 60;

export function datePlusHours(n = 1) {
    return Date.now() + (n * HOUR)
}
export function sleep(ms) {
    return new Promise((resolve)=> {
        setTimeout(resolve, ms)
    })
}

export function asyncRetry(fnc, times, delay = 100) { //TODO test
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



/**
 * Creates an object that is passed through crawler flow
 * @param localData this data can be overriden, deleted,
 * @param globalData this data stays intact (this is where crawl data is collected)
 * @returns {{local: *, global: {}}}
 */
export function createFlowObject(localData, globalData = {}) {
    return {
        local: localData,
        global: globalData
    }
}

/**
 * Used for invoking observers
 * @param fn
 * @returns {Function}
 */
export function coroutine(fn) {
    return function(...args) {
        const generetor = fn(...args);
        generetor.next();

        return generetor;
    }
}

