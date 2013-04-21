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
    axon_port : 40356,
    rpc_port : 40357,
    router : [{
	route : '#',
	dest : 'ConsoleTransport'
    },{
	route : 'carcass:*',
	dest : 'ConsoleTransport'
    },{
	route : '#',
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
