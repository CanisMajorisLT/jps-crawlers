
export default {
    templateUrl: 'client/last-crawl-summary/last-crawl-summary.html',
    controller: function($http) {
        const ctrl = this;
        function prepareDataForDisplay(lastCrawl) {
            ctrl.lastCrawlDate = moment(lastCrawl.crawlDate).format('YYYY-DD-MM hh:ss:mm');
            ctrl.lastCrawlDuration = lastCrawl.duration / 1000;
            ctrl.lastCrawlSources = lastCrawl.sources.join(', ');
            ctrl.lastCrawlErrors = lastCrawl.crawlErrors.length;
        }

        $http({
            method: 'GET',
            url: '/info'
        }).then((response)=> {
            console.log(response);
            prepareDataForDisplay(response.data.crawlLogs[0]);
        }, (error)=> {
            console.log('error', error);
        })
    }
}