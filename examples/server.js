//     __  _______
//    /  |/  / __ )
//   / /|_/ / __  |
//  / /  / / /_/ /
// /_/  /_/_____/
//
// Example for initiating MessageBus
//

var MB = require('..');

var mb = new MB({
    listen_port : 3044,
    keep_it_alive : true,
    router : [{
	route : 'log:*',
	dest : 'ConsoleTransport'
    },{
	route : 'carcass:*',
	dest : 'ConsoleTransport'
    },{
	route : 'reds:*',
	dest : 'RedisTransport',
	conf : {
	    port : 6379,
	    host : '127.0.0.1'
	}
    },{
	route : 'forward:*',
	dest : 'AxonForward',
	conf : {
	    port : 6380,
	    host : '127.0.0.1'
	}
    }]
});
