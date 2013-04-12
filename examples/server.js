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
    log_port : 9995,
    keep_it_alive : true,
    router : [{
	route : 'api:*',
	store : 'ConsoleBus'
    },{
	route : 'carcass:*',
	store : 'ConsoleBus'
    },{
	route : 'reds:*',
	store : 'RedisBus',
	db : {
	    port : 6379,
	    host : '127.0.0.1'
	}
    }]
});
