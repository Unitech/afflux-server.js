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
    rpc_port : 3055,
    http_port : 9898,
    keep_it_alive : true,
    router : [{
	route : '*',
	dest : 'ConsoleTransport'
    },{
	route : 'carcass:*',
	dest : 'ConsoleTransport'
    },{
	route : '*',
	dest : 'ElasticSearchTransport',
	conf : {
	    port : 9200,
	    host : '127.0.0.1'
	}
    }]
});

// ,{
// 	route : 'forward:*',
// 	dest : 'AxonForward',
// 	conf : {
// 	    port : 6380,
// 	    host : '127.0.0.1'
// 	}
//     }
