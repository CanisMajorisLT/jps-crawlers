
export default function($http, $q) {
    let cache = {};

    function httpGETandCache(url) {
        const restPromise =  $http({
            method: 'GET',
            url: url
        }).then((response)=> {
            console.log(url + ' success:', response.data);
            return $q.resolve(response.data);
        }, (error)=> {
            console.log(url + ' error:', error);
        });

        cache[url] = restPromise;
        return restPromise;
    }

    function getUrl(url) {
        if (cache[url]) {
            return cache[url];
        } else {
            return httpGETandCache(url);
        }
    }

    return {
        getUrl: getUrl
    }
}