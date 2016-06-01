
export default {
    templateUrl: 'client/parse-results-viewer/parse-result-viewer.html',
    controller: function($http) {
        const ctrl = this;

        $http({
            method: 'GET',
            url: '/entries'
        }).then((response)=> {
            ctrl.parsedAds = response.data.parsedAds;
        }, (error)=> {
            console.log('error', error);
        })
    }
}