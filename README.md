# MessageBus.js

MessageBus.js is a server log message that dispatch log messages to differents storage via a router.

```
       Logger       --|                      |--> DB
Connect middlewares --|------> MessageBus.js |--> Console
		                	     |--> SocketIO
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

# Clients available

- Logger client for MessageBus.js log server : https://github.com/Alexandre-Strzelewicz/MBClient

# License

(The MIT License)

Copyright (c) 2013 Wiredcraft <opensource@wiredcraft.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
