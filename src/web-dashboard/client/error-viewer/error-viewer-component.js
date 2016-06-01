export default {
    templateUrl: 'client/error-viewer/error-viewer.html',
    controller: function($http) {
        const ctrl = this;
        $http({
            method: 'GET',
            url: '/info'
        }).then((response)=> {
            ctrl.crawlErrors = response.data.crawlLogs
                .reduce((allErrors, log)=> {
                    return allErrors.concat(log.crawlErrors);
                }, [])
        }, (error)=> {
            console.log('error', error);
        })
    }
}