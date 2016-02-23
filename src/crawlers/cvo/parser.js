import $ from 'cheerio'
import { validateParse, isNotEmptyString, isNumber, isNotEmptyArray,
         isNotElementNotFound, ELEMENT_NOT_FOUND} from '../common/validators'


/**
 * Finds number of pages that display ads
 * @param {String} html
 * @returns {Number | String}
 * @private
 */
function extractTotalPageCount_(html) {
    var page = $.load(html);

    const lastPageWithAdsUri = page('#pagination').children().last().attr('href');

    const pagesCount = lastPageWithAdsUri.match(/=(\d+)/)[1];

    return pagesCount !== '' ? parseInt(pagesCount) : pagesCount
}

export let extractTotalPageCount = validateParse(extractTotalPageCount_, [isNumber]);



export function extractFrontInfoForOneAd(element, index, pageNumber) {
    var ad = $.load(element);

    function getUri(ad) {
        return ad('a[itemprop=title]').attr('href')
    }

    function getTitle(ad) {
        return ad('a[itemprop=title]').text().trim()
    }

    function getId(ad) {
        return ad('a[itemprop=title]').attr('target')
    }

    function getCompanyName(ad) {
        return ad('span a.contentCompanyName').text().trim()
    }

    function getCity(ad) {
        let city;

        const matchedElement = ad('a[itemprop=address]');

        // can't check for value not empty, since this element can have empty val, so we check for element not empty
        if (matchedElement.length === 0) return ELEMENT_NOT_FOUND;

        city =  ad('a[itemprop=address]').text();

        if (city === '') return 'Unspecified';
        else return city
    }

    function getViews(ad) {
        ad('td a[itemprop=address]').remove();

        const viewsWithText = ad('td[itemprop=jobLocation]').text().trim();
        const views = viewsWithText.match(/\s(\d+)/)[1];
        return parseInt(views)

    }

    function getExpiryDate(ad) {
        const dateWithText = ad('td.t_jobs_tech p').text();
        const expirtyDate = dateWithText.match(/iki\s(\d+\.\d+\.\d+)/)[1];
        return new Date(expirtyDate).getTime()
    }

    return {
        uri: validateParse(getUri, [isNotEmptyString])(ad),
        title: validateParse(getTitle, [isNotEmptyString])(ad),
        city: validateParse(getCity, [isNotEmptyString])(ad),
        company: validateParse(getCompanyName, [isNotElementNotFound])(ad),
        views: validateParse(getViews, [isNumber])(ad),
        expiryDate: validateParse(getExpiryDate, [isNumber])(ad),
        id: validateParse(getId, [isNotEmptyString])(ad),
        adIndex: index,
        pageNumber
    }
}


export function extractFrontInfo(html, task){
    const  page = $.load(html);

    function getArticles(page) {
        return page('#table_jobs tbody tr').filter(function(){
            return $(this).text() !== 'Premium listing'
        }).get().slice()
    }

    const articles = validateParse(getArticles, [isNotEmptyArray])(page);

    return articles.map((elem, index)=> extractFrontInfoForOneAd(elem, index, task.pageNumber))
}



