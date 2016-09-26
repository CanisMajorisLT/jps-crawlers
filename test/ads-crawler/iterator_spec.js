import { expect } from 'chai'
import nock from 'nock'
import $ from 'cheerio'
import { iterator } from '../../src/crawlers/lib/api/pageIterator'


// This is more of an integration test
describe('iterator', () =>{

    it('returns a flow type of function, which calls next with generator that yields basic urls when given basic setup', (done) =>{
        nock('http://example.com')
            .get('/pages')
            .reply(200, '<html><div class="pages">10</div></html>');

        nock('http://example.com')
            .get(/page=/)
            .reply(200, uri => `<div>${uri.match(/=(\d+)/)[1]}</div>`);

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

        function* testTaskObserver() {
            try {
                let iter = -1;
                while (true) {
                    iter++;
                    let val = yield;
                    expect(val).to.have.property('pageUri').that.equals(`http://example.com/page=${iter}`);
                }
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