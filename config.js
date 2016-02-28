var rc = require('rc');
var pckg = require('./package.json');

module.exports = rc(pckg.name, {
    "general": {"crawlInterval": 200000, "workers": 1},
    "task": {
        "defaultTaskDelay": 5000,
        "defaultTaskRequeue": 5,
        "defaultTaskRetry": 5,
        "defaultTaskRetryInterval": 100,
        "DEFAULT_TASK_DELAY": 10000,
        "DEFAULT_TASK_REQUEUE": 5,
        "DEFAULT_TASK_RETRY": 5,
        "DEFAULT_TASK_RETRY_INTERVAL": 100
    }
});