export default {
    templateUrl: 'client/error-viewer/error-viewer.html',
    controller: function(dataFetchService) {
        const ctrl = this;
        dataFetchService.getUrl('/info').then((responseData)=> {
            ctrl.crawlErrors = responseData.crawlLogs
                .reduce((allErrors, log)=> {
                    return allErrors.concat(log.crawlErrors);
                }, [])
        });
    }
}