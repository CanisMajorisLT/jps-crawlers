import { expect } from 'chai'
import  $ from 'cheerio'
import { validateParse, isNumber, isNotEmptyArray } from '../src/crawlers/common/validators'
import { makeParserError } from '../src/crawlers/common/errors'

describe("Crawlers common spec suite", () =>{
    it("Works", () =>{
        expect(5).to.equal(5)
    })
});

describe("validators", () =>{

    const html = `<div id="wrap">
                    <ul class="count">
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                    </ul>
                  </div>`;

    describe("validateParse", () =>{

        function getThirdLi(element) {
            const el = $.load(element);
            const thirdLi =  el('.count li').get(2);

            return $(thirdLi).text()
        }

        function countLi(element) {
            const el = $.load(element);

            return el('li').get().length

        }

        it("returns original value when no validators supplied", () =>{
            const wrapperParser = validateParse(getThirdLi, []);

            const result = wrapperParser(html);

            expect(result).to.equal('Three')

        });

        it("throws a custom error when one of validators return false", () =>{
            const wrapperParser = validateParse(countLi, [isNotEmptyArray]);

            let result;

            try {
                 wrapperParser(html);
            } catch(e){
                 result = e
            }

            expect(result).to.deep.equal(makeParserError(html, 'countLi', 'isNotEmptyArray'))

        });

        it("throws no error when validators pass", () =>{
            const wrapperParser = validateParse(countLi, [isNumber]);

            const result = wrapperParser(html);

            expect(result).to.equal(3)
        })
    })

});