var rc = require('rc');
var pckg = require('./package.json');

module.exports = function() {
    return rc(pckg.name, {
        "general": {
            "crawlInterval": 200000,
            "workers": 1
        },
        "task": {
            "DEFAULT_TASK_DELAY": 10000,
            "DEFAULT_TASK_REQUEUE": 5,
            "DEFAULT_TASK_RETRY": 5,
            "DEFAULT_TASK_RETRY_INTERVAL": 100
        }
    })
};