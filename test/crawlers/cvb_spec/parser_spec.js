import { expect } from 'chai';
import fs from 'fs'
import * as parser from '../../../src/crawlers/cvb/parser';

describe("Cvb parser", () => {

    let fullPageHtml;

    before((done)=> {
        fs.readFile(__dirname + '/fullPage.html', (error, html)=> {
            fullPageHtml = html.toString();
            done()
        })
    });

    describe("extractTotalPageCount", () => {
        it("finds total number of ad listing pages", () => {

            const result = parser.extractTotalPageCount(fullPageHtml);

            expect(result).to.equal(55)
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
/*
        console.log(fullPageHtml); //TODO
        const result = parser.extractFrontInfo(fullPageHtml);

        result.forEach((r)=> {
            it("each data object has 6 properties", () => {
                   //expect(r).to.have.properties(['id'])
            })
        })*/

    })

});