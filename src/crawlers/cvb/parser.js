import $ from 'cheerio'
import { validateParse, isNotEmptyString, isNumber, isNotEmptyArray } from '../common/validators'


/**
 * Finds number of pages that display ads
 * @param {String} html
 * @returns {Number | String}
 * @private
 */
function extractTotalPageCount_(html) {
    var page = $.load(html);

    const pagesCount = page('.pages_ul_inner').children().last().text();

    return pagesCount !== '' ? parseInt(pagesCount) : pagesCount
}

export let extractTotalPageCount = validateParse(extractTotalPageCount_, [isNumber]);



function extractFrontInfoForOneAd(element, index, pageNumber) {
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


export function extractFrontInfo(html, task){
    var page = $.load(html);

    function getArticles(page) {
        return page('#job_ad_list article').get()
    }

    // last page can sometimes have no ads, so validation fires alarm too often
    const articles = task.isLastPage ? getArticles(page) : validateParse(getArticles, [isNotEmptyArray])(page);

    return articles.map((elem, index)=> extractFrontInfoForOneAd(elem, index, task.pageNumber))
}



