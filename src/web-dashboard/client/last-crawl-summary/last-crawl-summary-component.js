
export default {
    templateUrl: 'client/last-crawl-summary/last-crawl-summary.html',
    controller: function(dataFetchService, $q) {
        const ctrl = this;
        function prepareDataForDisplay(responseData) {
            const lastCrawl = responseData.crawlLogs[0];
            const parsedAdsNumber = responseData.parsedAdsNumber;
            ctrl.lastCrawlDate = moment(lastCrawl.crawlDate).format('YYYY-MM-DD HH:mm:ss');
            ctrl.lastCrawlDuration = lastCrawl.duration / 1000;
            ctrl.lastCrawlSources = lastCrawl.sources.join(', ');
            ctrl.parsedAdsNumber = parsedAdsNumber;
            ctrl.lastCrawlErrors = lastCrawl.crawlErrors.length;
        }

        $q.all([dataFetchService.getUrl('/options'), dataFetchService.getUrl('/info')])
            .then((bothResults)=> {
                const optionsData = bothResults[0];
                const infoData = bothResults[1];
                prepareDataForDisplay(infoData);

                let currentTime = moment();
                let lastCrawlTime = moment(infoData.crawlLogs[0].crawlDate);
                const crawlInterval = optionsData.general.crawlInterval;
                lastCrawlTime.add(crawlInterval, 'hours');

                ctrl.nextCrawlIn = lastCrawlTime.diff(currentTime, 'minutes');
            });
    }
}