
// In main file init the logger
var Logger = require('../loggers/Logger.js');

Logger.init({
    port : 9995,
    ip : '127.0.0.1',
    remote : true
});

// In files 
var log = Logger.getLogger('MAIN');

setInterval(function() {
    log({my : 'message'});
}, 300);

