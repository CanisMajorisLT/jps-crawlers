var winston = require('winston');
require('winston-loggly');

module.exports = new (winston.Logger)({
   transports: [
       new (winston.transports.Console)({
           level: 'debug',
           colorize: true,
           prettyPrint: true,
           handleExceptions: true,
           humanReadableUnhandledException: true
       }),
       new (winston.transports.File)({
           name: "error-logger",
           colorize: true,
           prettyPrint: true,
           filename: __dirname + "/error.log",
           level: "error",
           maxFiles: 1,
           maxsize: 6553600, // 50mb
           handleExceptions: true,
           humanReadableUnhandledException: true
       }),
       new (winston.transports.File)({
           name: "info-logger",
           colorize: true,
           prettyPrint: true,
           filename: __dirname + "/info.log",
           level: "info",
           maxFiles: 1,
           maxsize: 6553600
       }),
       new (winston.transports.Loggly)({
           token: "212fde71-0c4c-4ed1-b133-08f7b2e1b2b0", // FIXME perkelti visa webini configa imongo, galiam fallbackinti i rc
           subdomain: "vytkbutke",
           tags: ["Winston-NodeJS"],
           json:true
       })
   ]
});