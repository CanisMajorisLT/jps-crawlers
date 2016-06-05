
export default {
    templateUrl: 'client/parse-results-viewer/parse-result-viewer.html',
    controller: function(dataFetchService) {
        const ctrl = this;

        dataFetchService.getUrl('/entries')
        .then((responseData)=> {
            ctrl.parsedAds = responseData.parsedAds;
        })
    }
}