//     __  _______
//    /  |/  / __ )
//   / /|_/ / __  |
//  / /  / / /_/ /
// /_/  /_/_____/
//
// Message Bus router

// Uncomment to display debug message
// process.env.DEBUG = 'MB:*, MB';

var axon = require('axon');
var rpc = require('axon-rpc');
var debug = require('debug')('MB');

var ConsoleTransport = require('./transports/ConsoleTransport.js');
var RedisTransport = require('./transports/RedisTransport.js');
var AxonForward = require('./transports/AxonForward.js');

var MB = module.exports = function(options) {
    var self = this;

    this.running = false;
    
    self.transports = [];

    var bindRpcSocket = function() {
	debug('Binding RPC socket');
	var axs = axon.socket('rep');
	self.rpc_sock = new rpc.Server(axs);
	axs.bind(options.rpc_port);
	self.rpc_sock.expose({
	    push_msg : function(event, data) {
		console.log(arguments);
	    }
	});
	
    };
    
    // Port which listen to incoming log message
    var bindPullSocket = function() {
	self.pull_sock = axon.socket('sub-emitter');
	self.options = options;
	self.pSock = self.pull_sock.bind(options.listen_port || 3044);
    };

    // Generate router / instancy transport driver
    var generateRouter = function() {
	var router = options.router;
	
	router.forEach(function(route) {

	    try {
		var genBus = eval(route.dest);
		var transport = new genBus(route.conf);
	    } catch(e) {
		throw new Error('Transport ' + route.dest + ' error : ' + e);
	    }

	    // Send init message to all bus
	    transport.push('Messagebus', {state : 'Ready', date : new Date()});
	    
	    debug('Mounting route : ' + route.route + ' to type : ' + transport.title);

	    // When receiving message send to transport
	    self.pull_sock.on(route.route, function(event, data) {
		debug('New message sent to ' + route.dest + ' event = ' +  event + ' | msg = ', data);
		transport.push(event, data);
	    });
	    
	    self.transports.push(transport);
	});
	self.running = true;
    };

    function closeConnections(msg) {
	self.pSock.server.close();
	self.transports.forEach(function(transport) {
	    transport.push('Messagebus', {
		state : 'closing',
		msg : msg,
		date : new Date()
	    });
	    transport.close();
	    delete transport;		
	});
	self.transports = [];
	self.running = false;
    }
    
    // Keep the process alive
    var keepItAlive = function() {		
	
	process.on('SIGINT', function (err) {
	    closeConnections('SIGINT received');
	    process.exit(0);
	});

	process.on('uncaughtException', function (err) {
	    closeConnections(err);
	    bindPullSocket();
	    generateRouter();
	});
    };

    function start() {
	bindPullSocket();
	bindRpcSocket();
	generateRouter();
	
	if (options.keep_it_alive || true)
	    keepItAlive();
    }

    start();

    // Exposed    
    return {
	close : function() {
	    closeConnections('Stopped by close method');
	}
    };
};
