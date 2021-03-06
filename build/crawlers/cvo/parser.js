'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractTotalPageCount = undefined;
exports.extractFrontInfoForOneAd = extractFrontInfoForOneAd;
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

    var lastPageWithAdsUri = page('#pagination').children().last().attr('href');

    var pagesCount = lastPageWithAdsUri.match(/=(\d+)/)[1];

    return pagesCount !== '' ? parseInt(pagesCount) : pagesCount;
}

var extractTotalPageCount = exports.extractTotalPageCount = (0, _validators.validateParse)(extractTotalPageCount_, [_validators.isNumber]);

function extractFrontInfoForOneAd(element, index, pageNumber) {
    var ad = _cheerio2.default.load(element);

    function getUri(ad) {
        return ad('a[itemprop=title]').attr('href');
    }

    function getTitle(ad) {
        return ad('a[itemprop=title]').text().trim();
    }

    function getId(ad) {
        return ad('a[itemprop=title]').attr('target');
    }

    function getCompanyName(ad) {
        return ad('span a.contentCompanyName').text().trim();
    }

    function getCity(ad) {
        var city = void 0;

        var matchedElement = ad('a[itemprop=address]');

        // can't check for value not empty, since this element can have empty val, so we check for element not empty
        if (matchedElement.length === 0) return _validators.ELEMENT_NOT_FOUND;

        city = ad('a[itemprop=address]').text();

        if (city === '') return 'Unspecified';else return city;
    }

    function getViews(ad) {
        ad('td a[itemprop=address]').remove();

        var viewsWithText = ad('td[itemprop=jobLocation]').text().trim();
        var views = viewsWithText.match(/\s(\d+)/)[1];
        return parseInt(views);
    }

    function getExpiryDate(ad) {
        var dateWithText = ad('td.t_jobs_tech p').text();
        var expirtyDate = dateWithText.match(/iki\s(\d+\.\d+\.\d+)/)[1];
        return new Date(expirtyDate);
    }

    return {
        uri: (0, _validators.validateParse)(getUri, [_validators.isNotEmptyString])(ad),
        title: (0, _validators.validateParse)(getTitle, [_validators.isNotEmptyString])(ad),
        city: (0, _validators.validateParse)(getCity, [_validators.isNotEmptyString])(ad),
        company: (0, _validators.validateParse)(getCompanyName, [_validators.isNotElementNotFound])(ad),
        views: (0, _validators.validateParse)(getViews, [_validators.isNumber])(ad),
        expiryDate: (0, _validators.validateParse)(getExpiryDate, [_validators.isDate])(ad),
        id: (0, _validators.validateParse)(getId, [_validators.isNotEmptyString])(ad),
        meta: {
            adIndex: index,
            pageNumber: pageNumber
        }
    };
}

function extractFrontInfo(html, task) {
    var page = _cheerio2.default.load(html);

    function getArticles(page) {
        return page('#table_jobs tbody tr').filter(function () {
            return (0, _cheerio2.default)(this).text() !== 'Premium listing';
        }).get().slice();
    }

    // last page can sometimes have no ads, so validation fires alarm too often
    var articles = task.isLastPage ? getArticles(page) : (0, _validators.validateParse)(getArticles, [_validators.isNotEmptyArray])(page);

    return articles.map(function (elem, index) {
        return extractFrontInfoForOneAd(elem, index, task.pageNumber);
    });
}
//# sourceMappingURL=parser.js.map
