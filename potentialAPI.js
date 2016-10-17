function AdCrawler() {

}

// Core idea, all data given and denerated by crawler flows down and is accessible to lower parts, this way
// it can build up the data

new AdCrawler('CVBankas')
    .use(AdCrawler.SCRAPE_EGINES.REQUST)
    .options({})
    .validate()
    .iterate({ // for generic pages
        pageCountUrl: 'http://www.cvbankas.lt/?page=1',
        parser: (html) => {return 100},
        iterateUrl: 'http://www.cvbankas.lt/?page=${page}',
        startIndex: 0
    })
    .iterate(() => { // for more complex where need some custom way to get
        // TODO
    })
    .parse(() => {
        function extractFrontInfoForOneAd(element, index, pageNumber) {
            const validateParse = AdCrawler.parseUtils.validateParse;
            var ad = $.load(element);

            function getUri(ad) {
                return ad('a').attr('href')
            }

            function getTitle(ad) {
                return ad('.list_cell h3').text()
            }

            function getId(ad) {
                return parseInt(ad('form input[name=ad_id]').attr('value'))
            }

            function getCompanyName(ad) {
                return ad('div.list_cell img').attr('alt')
            }

            function getSecondaryCompanyName(ad) {
                ad('span.jobadlist_salary').remove();
                return ad('.heading_secondary').text().trim()
            }

            function getCity(ad) {
                return ad('span[class=list_city]').text()
            }

            return {
                uri: validateParse(getUri, [isNotEmptyString])(ad),
                title: validateParse(getTitle, [isNotEmptyString])(ad),
                city: validateParse(getCity, [isNotEmptyString])(ad),
                company: validateParse(getCompanyName, [isNotEmptyString])(ad),
                companySecondary: validateParse(getSecondaryCompanyName, [isNotEmptyString])(ad),
                id: validateParse(getId, [isNumber])(ad),
                meta : {
                    adIndex: index,
                    pageNumber
                }

            }
        }


        return function extractFrontInfo(html, task){
            var page = $.load(html);

            function getArticles(page) {
                return page('#job_ad_list article').get()
            }

            // last page can sometimes have no ads, so validation fires alarm too often
            const articles = task.isLastPage ? getArticles(page) : validateParse(getArticles, [isNotEmptyArray])(page);

            return articles.map((elem, index)=> extractFrontInfoForOneAd(elem, index, task.pageNumber))
        }
    })
    .iterate((core, next, data) => { // optional, must return a generator that yields page urls
        // we reuse same task-queue model, basically we must generate more tasks
        // we must return tasks that will be passed to workers, tasks must have a URI
    })
    .parse(() => {
        // extracted html for each task from previous iterate, any data parsed from here  will be joined with previous data [article
        // that was used to make this task
    })
    .iterate(() => {}) // and so on
    .parse(() => {}) // and so on
    .formModel((article) => { // by default is uses default article structure as returned by parser
        return {
            field: article.field + article.field2
        }
    })
    .start();