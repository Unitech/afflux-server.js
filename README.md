
# MB - Message Bus

How to use ?

## Client

```javascript
// In main file init the logger
var Logger = require('../loggers/Logger.js');

Logger.init({
    port : 9995,
    ip : '127.0.0.1',
    remote : true
});

// In files 

// When you creates a logger replace MAIN by the name of your logger
// like you do with debug module
var log = Logger.getLogger('MAIN');

// Example
setInterval(function() {
    log({my : 'message'});
}, 300);
```

## Server

Features : 
- Message router
- Console, Redis and Couchbase transports available
- Keep it alive feature
- Connection/Closing report to transports

```javascript
var MB = require('MessageBus');

var mb = new MB({
    log_port : 9995,
    keep_it_alive : true,
    router : [{
	route : '*',
	store : 'ConsoleBus'
    },{
	route : 'console:*',
	store : 'ConsoleBus'
    },{
	route : 'redis:*',
	store : 'RedisBus',
	db : {
	    port : 6379,
	    host : '127.0.0.1'
	}
    }]
});
```
