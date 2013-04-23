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
var postal = require('postal')(require('underscore'));

var ConsoleTransport = require('./transports/ConsoleTransport.js');
var AxonForward = require('./transports/AxonForward.js');
var ElasticSearchTransport = require('./transports/ElasticSearchTransport.js');

var MB = module.exports = function(options) {
	var self = this;

	this.running = false;
	this.main_channel = postal.channel();
	this.transports = [];
	this.rpc_port = options.rpc_port || 40044;
	this.axon_port = options.axon_port || 3044;
	this.last_message = {};


    // RPC input
    var bindRpcSocket = function() {
    	debug('Binding RPC socket on port %d', self.rpc_port);

    	var axs = axon.socket('rep');
    	self.rpc_sock = new rpc.Server(axs);
    	self.rpc_event = axs.bind(self.rpc_port);

    	self.rpc_sock.expose({
    		push_msg : function(event, data) {
    			debug('New msg received from RPC : %s with data : %s', event, data);
    			self.main_channel.publish(event, {event : event, msg : data});
    		}
    	});	
    };

    // Socket (Axon) input
    var bindPullSocket = function() {
    	debug('Binding Axon socket on port %d', self.axon_port);

    	self.pull_sock = axon.socket('sub-emitter');
    	self.listen_sock = self.pull_sock.bind(self.axon_port);

    	self.pull_sock.on('*', function(event, data) {
    		debug('New msg received from socket : %s, %s', event, data + '');
    		self.main_channel.publish(event, {event : event, msg : data});
    	});
    };

    // Route generator
    var generateRouter = function() {
    	var router = options.router;

    	router.forEach(function(route) {

    		debug('Binding route : %s to dest : %s', route.route, route.dest);

    		try {
    			var genBus = eval(route.dest);
    			var transport = new genBus(route.conf);
    		} catch(e) {
    			throw new Error('Transport ' + route.dest + ' error : ' + e);
    		}

	    // Send init message to all bus
	    transport.push('Messagebus', { state : 'Ready', date : new Date() });
	    
	    self.main_channel.subscribe(route.route, function(data) {
	    	var event = data.event;
	    	var msg = data.msg;

	    	self.last_message = data;
	    	debug('New pub for route : %s to %s with data : %s',
	    		route.route, route.dest, msg);

	    	transport.push(event, msg);
	    });
	    
	    self.transports.push(transport);
	});
    	self.running = true;
    };

    var closeConnections = function(msg) {
    	self.listen_sock.server.close();
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
    };
    
    // Keep the process alive
    var keepItAlive = function() {	
    	process.on('SIGINT', function (err) {
    		closeConnections('SIGINT received');
    		process.exit(0);
    	});

    	process.on('error', function(err) {
    		console.log(err);
    	})
    	process.on('uncaughtException', function (err) {
            console.log(err);
    		closeConnections(err);

    		if (options.keep_it_alive || true) {
    			bindPullSocket();
    			generateRouter();
    		}
    		else process.exit(0);
    	});
    };

    var start = function() {
    	keepItAlive();
    	bindPullSocket();
    	bindRpcSocket();
    	generateRouter();
    };

    // closure 
    var getLastMessage = function() {
    	return self.last_message;
    }

    start();

    // Exposed
    return {
    	close : function() {
    		closeConnections('Stopped by close method');
    	},
    	getLastMessage : getLastMessage
    };
};
