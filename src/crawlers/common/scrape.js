import requestPromise from 'request-promise'
import { makeFetchError } from './errors'

export function getPageBody(uri, retries){ //TODO test
    var triesLimit = retries || 5;
    var currentTry = 0;

    var resolveR;
    var rejectR;
    var promiseR = new Promise(function(res,rej){
        resolveR = res;
        rejectR = rej
    });

    function recursiveGet(){
        getPage(uri)
            .then(function(body){
                resolveR(body)
            })
            .catch(function(error){
                currentTry++;
                if (currentTry < triesLimit) {
                    setTimeout(recursiveGet, currentTry  * 100)
                }
                 else {
                    rejectR(makeFetchError(uri, error.error))
                }
            });
    }

    recursiveGet();


    return promiseR

};

function getPage(uri) {
    var options = {
        simple: true, // reject if statusCode !== 2xx
        uri: uri
    };

    return requestPromise(options)

}



