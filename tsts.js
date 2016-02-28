var logger = require('./logging/logger');

logger.query({
    from: new Date - 24 * 60 * 60 * 1000,
    until: new Date,
    start: 0,
    order: 'desc',
}, function(err, res){
    console.log(err);
    console.log(res['error-logger']);
})