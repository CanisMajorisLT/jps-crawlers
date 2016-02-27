var rc = require('rc');
var pckg = require('./package.json');

module.exports = rc(pckg.name, {
    // all configs go there, webserver will modify rc file
})