import $ from 'cheerio'
import { validateParse, notEmptyString, isNumber, isNotEmptyArray } from '../common/validators'


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

export let extractTotalPageCount = validateParse(extractTotalPageCount_, [notEmptyString]);



function extractFrontInfoForOneAd(element) {
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
        uri: validateParse(getUri, [notEmptyString])(ad),
        title: validateParse(getTitle, [notEmptyString])(ad),
        city: validateParse(getCity, [notEmptyString])(ad),
        company: validateParse(getCompanyName, [notEmptyString])(ad),
        companySecondary: validateParse(getSecondaryCompanyName, [notEmptyString])(ad),
        id: validateParse(getId, [isNumber])(ad)
    }
}


export function extractFrontInfo(html){
    var page = $.load(html);

    function getArticles(page) {
        return page('#job_ad_list article').get()
    }

    const articles = validateParse(getArticles, [isNotEmptyArray])(page);

    return articles.map(extractFrontInfoForOneAd)
}



