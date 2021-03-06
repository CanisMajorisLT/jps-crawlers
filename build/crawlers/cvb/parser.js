'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractTotalPageCount = undefined;
exports.extractFrontInfo = extractFrontInfo;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _validators = require('../lib/validators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Finds number of pages that display ads
 * @param {String} html
 * @returns {Number | String}
 * @private
 */
function extractTotalPageCount_(html) {
    var page = _cheerio2.default.load(html);

    var pagesCount = page('.pages_ul_inner').children().last().text();

    return pagesCount !== '' ? parseInt(pagesCount) : pagesCount;
}

var extractTotalPageCount = exports.extractTotalPageCount = (0, _validators.validateParse)(extractTotalPageCount_, [_validators.isNumber]);

function extractFrontInfoForOneAd(element, index, pageNumber) {
    var ad = _cheerio2.default.load(element);

    function getUri(ad) {
        return ad('a').attr('href');
    }

    function getTitle(ad) {
        return ad('.list_cell h3').text();
    }

    function getId(ad) {
        return parseInt(ad('form input[name=ad_id]').attr('value'));
    }

    function getCompanyName(ad) {
        return ad('div.list_cell img').attr('alt');
    }

    function getSecondaryCompanyName(ad) {
        ad('span.jobadlist_salary').remove();
        return ad('.heading_secondary').text().trim();
    }

    function getCity(ad) {
        return ad('span[class=list_city]').text();
    }

    return {
        uri: (0, _validators.validateParse)(getUri, [_validators.isNotEmptyString])(ad),
        title: (0, _validators.validateParse)(getTitle, [_validators.isNotEmptyString])(ad),
        city: (0, _validators.validateParse)(getCity, [_validators.isNotEmptyString])(ad),
        company: (0, _validators.validateParse)(getCompanyName, [_validators.isNotEmptyString])(ad),
        companySecondary: (0, _validators.validateParse)(getSecondaryCompanyName, [_validators.isNotEmptyString])(ad),
        id: (0, _validators.validateParse)(getId, [_validators.isNumber])(ad),
        meta: {
            adIndex: index,
            pageNumber: pageNumber
        }

    };
}

function extractFrontInfo(html, task) {
    var page = _cheerio2.default.load(html);

    function getArticles(page) {
        return page('#job_ad_list article').get();
    }

    // last page can sometimes have no ads, so validation fires alarm too often
    var articles = task.isLastPage ? getArticles(page) : (0, _validators.validateParse)(getArticles, [_validators.isNotEmptyArray])(page);

    return articles.map(function (elem, index) {
        return extractFrontInfoForOneAd(elem, index, task.pageNumber);
    });
}
//# sourceMappingURL=parser.js.map
