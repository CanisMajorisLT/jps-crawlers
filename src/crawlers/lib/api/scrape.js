import requestPromise from 'request-promise'
import { asyncRetry } from './utils' // TODO use it for getPageBody
import { makeFetchError } from './errors'

export function getPageBody(uri, retries = 5){ //TODO test
    let currentTry = 0;

    let resolveR;
    let rejectR;
    const promiseR = new Promise(function(res,rej){
        resolveR = res;
        rejectR = rej;
    });

    function recursiveGet(){
        getPage(uri)
            .then((body)=> resolveR(body))
            .catch(function(error){
                currentTry++;
                if (currentTry < retries) {
                    setTimeout(recursiveGet, currentTry  * 100)
                }
                 else {
                    rejectR(makeFetchError(uri, error.error))
                }
            });
    }

    recursiveGet();


    return promiseR;

}

function getPage(uri) {
    const options = {
        simple: true, // reject if statusCode !== 2xx
        uri: uri
    };

    return requestPromise(options);

}



