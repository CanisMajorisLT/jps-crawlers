var logger = require('./logging/logger');

logger.query({
    from: new Date() - 1000 * 60 * 60,
    until: new Date(),
    start: 0,
    query: 'error',
    order: 'desc'
}, function(error, result) {
    error && console.log(error);
    console.log(result['error-logger'])
})