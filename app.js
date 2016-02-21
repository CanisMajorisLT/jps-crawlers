var $ = require('cheerio');
var rp = require('request-promise');


/*request('http://www.cvbankas.lt/?page=1', function(error, response, body){
    console.log(body);
});*/

rp({
    method: 'GET',
    uri: 'http://www.cvbankas.lt/?page=1',
    transform: function(body){
        return $.load(body)
    }
})
    .then(function(r){
        r('article').each((s, e)=>{console.log(s, $(e).html());})

    })

