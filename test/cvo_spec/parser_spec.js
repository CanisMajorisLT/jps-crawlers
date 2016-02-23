import { expect } from 'chai';
import fs from 'fs'
import * as parser from '../../src/crawlers/cvo/parser';

function readFileToAsync(dir) {
    return new Promise((resolve, reject)=> {
        fs.readFile(dir, (error, html)=> {
            error && reject(error);
            resolve(html.toString())
        })
    })
}

describe("Cvb parser", () => {

    let fullPageHtml;
    let fullVeryLastPageHtml;
    let frontJobArticle;

    before((done)=> {
        async function loadHtml() {
            fullPageHtml = await readFileToAsync(__dirname + '/fullPage.html');
            fullVeryLastPageHtml = await readFileToAsync(__dirname + '/fullLastPage.html');
            frontJobArticle = await readFileToAsync(__dirname + '/frontJobArticle.html');

            done()
        }

        loadHtml()
    });

    describe("extractTotalPageCount", () => {
        it("finds total number of ad listing pages", () => {

            const result = parser.extractTotalPageCount(fullVeryLastPageHtml);

            expect(result).to.equal(56)
        });

        it("returns custom error when can't find value at his path", () => {
            const html = '<div></div>';

            expect(()=> {
                parser.extractTotalPageCount(html)
            }).to.throw(); // TODO check name of error
        })
    });

    describe("extractFrontInfo", () => {
        it("returns an array of extracted data", () => {
            const result = parser.extractFrontInfo(fullPageHtml, {pageNumber: 0});
            expect(result).to.be.an('array').with.length(52);

        });


    });

    describe("extractFrontInfoForOneAd", () => {

        it("extracts city, title, ad uri, company, and unique id", () => {
            let result = parser.extractFrontInfoForOneAd(frontJobArticle, 0, 0);

            expect(result).to.be.an('object')
                .with.all.keys('uri', 'title', 'city', 'company', 'id', 'views', 'expiryDate', 'adIndex', 'pageNumber');

            expect(result.uri).to.equal('//www.cvonline.lt/darbo-skelbimas/maxima/kasininkas-pardavejas-a-terminuota-sutartis-zarasai-f3013291.html');
            expect(result.title).to.equal('KASININKAS - PARDAVĖJAS (-A) TERMINUOTA SUTARTIS (ZARASAI)');
            expect(result.city).to.equal('Zarasai');
            expect(result.company).to.equal('MAXIMA');
            expect(result.id).to.equal('Jobad3013291');
            expect(result.views).to.equal(28);
            expect(result.expiryDate).to.equal(1456696800000);
            expect(result.adIndex).to.equal(0);
            expect(result.pageNumber).to.equal(0);

        })

    })

});