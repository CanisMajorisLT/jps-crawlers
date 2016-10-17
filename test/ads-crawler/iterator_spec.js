import { expect } from 'chai'
import nock from 'nock'
import $ from 'cheerio'
import { iterator } from '../../src/crawlers/lib/api/pageIterator'


// This is more of an integration test
describe('iterator', () =>{

    it('returns a flow type of function, which calls next with generator that yields html from basic urls when given basic setup', (done) =>{
        nock('http://example.com')
            .get('/pages')
            .reply(200, '<html><div class="pages">10</div></html>');


        function setupNocForPageGet() { // nock requires to setup mock for each url
            function setup(i) {
                nock('http://example.com')
                    .get('/page='+i)
                    .reply(200, uri => `<div>${uri.match(/=(\d+)/)[1]}</div>`);
            }
            [0,1,2,3,4,5,6,7,8,9,10].forEach(setup)
        }

        setupNocForPageGet();

        const basicSetup = {
            pageCountUrl: 'http://example.com/pages',
            parser: (html => {
                const page = $.load(html);
                return page('.pages').text().trim();
            }),
            startIndex: 0,
            iterateUrl: 'http://example.com/page=${page}'
        };

        const flowFnc = iterator(basicSetup);

        async function testToSeeIfGetHtmlYieldsPromisesResolvingToHtml(crawlDetails, i) {
            try {
                let html = await crawlDetails.getHtml();
                expect(html).to.equal(`<div>${i}</div>`);
            } catch (e) {
                done(e);
            }
        }



        function* testTaskObserver() {
            try {
                let iter = -1;
                while (true) {
                    iter++;
                    let val = yield;
                    expect(val).to.have.property('local');
                    expect(val).to.have.property('global');
                    expect(val.local.crawlDetails).to.have.property('getHtml');
                    testToSeeIfGetHtmlYieldsPromisesResolvingToHtml(val.local.crawlDetails, iter);
                }
            } catch (e) {
                done(e);
            } finally {
                done();
            }
        }


        function testTaskCreator(taskCreator) {
            const observer = testTaskObserver();
            observer.next();
            taskCreator(observer);
        }

        flowFnc({})(testTaskCreator)({})
    });
});