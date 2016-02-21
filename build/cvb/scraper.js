'use strict';

var rp = require('request-promise');
var $ = require('cheerio');
var async = require('async');
var ADS_URL = 'http://www.cvbankas.lt/?page=${page}';

function getNextPageUri(body) {
    var p = $.load(body);
    var prevNext = p('.prev_next').get();
    console.log('prevNext', prevNext);
    if (prevNext.length < 2) {
        return null;
    } else {
        return prevNext.reduce(function (f, s) {
            console.log(f, s);
            var fUrl = $(f).attr('href');
            var sUrl = $(s).attr('href');

            return parseInt(fUrl.match(/\d+/)[0]) > parseInt(sUrl.match(/\d+/)[0]) ? fUrl : sUrl;
        });
    }
}

function getBodyWithArticles(uri) {
    var query = {
        method: 'GET',
        uri: uri
    };

    return new Promise(function (resolve, reject) {
        rp(query).then(function (body) {
            resolve({
                body: body,
                nextUri: getNextPageUri(body)
            });
        }).catch(function () {
            reject(Error('failed'));
        });
    });
}

getBodyWithArticles('http://www.cvbankas.lt/?page=1').then(function (r) {
    console.log(r);
});

function getAds(url) {
    rp({
        method: 'GET',
        uri: 'http://www.cvbankas.lt/?page=1'
    }).then(function (body) {}).error(function (error) {});
}

/*rp({
    method: 'GET',
    uri: 'http://www.cvbankas.lt/?page=1',
    transform: function(body) {
        return $.load(body)
    }
})
    .then(function(r) {
        var frontData = r('#job_ad_list article').map((s, e)=> {
            return extractFrontInfo(e);
        });

        async.eachSeries(frontData, function(info, cb) {
            console.log(info);
            rp({
                method: 'GET',
                uri: info.url,
                transform: function(body) {
                    return $.load(body)
                }
            })
                .then(function(result) {
                    extractInsideInfo(result);
                    setTimeout(cb, 5000)
                })


        });
    });*/

function extractFrontInfo(element) {
    var ad = $.load(element);
    return {
        url: ad('a').attr('href'),
        title: ad('.list_cell h3').text(),
        id: ad('form input[name=ad_id]').attr('value')
    };
}

function getUrl(url) {
    return rp({
        method: 'GET',
        uri: url
    });
}

function extractInsideInfo(element) {

    var page = element;

    console.log(page.html());

    console.log($('#jobad_cont').html());
}
//# sourceMappingURL=scraper.js.map