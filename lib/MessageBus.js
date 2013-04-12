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
var debug = require('debug')('MB');

var ConsoleBus = require('./transports/ConsoleBus.js');
var RedisBus = require('./transports/RedisBus.js');
//var CouchbaseBus = require('./transports/CouchbaseBus.js');

var MB = module.exports = function(options) {
    var self = this;
    
    self.transports = [];

    // Port which listent to incoming log message
    var bindPullSocket = function() {
	self.pull_sock = axon.socket('sub-emitter');
	self.options = options;
	self.pSock = self.pull_sock.bind(options.log_port || 44444);
    };

    // Generate router / instancy transport driver
    var generateRouter = function() {
	var router = options.router;

	var genObj = eval('ConsoleBus');
	
	router.forEach(function(route) {
	    
	    var genBus = eval(route.store);
	    var transport = new genBus(route.db);

	    // Send init message to all bus
	    transport.push('Messagebus', {state : 'Ready', date : new Date()});
	    
	    debug('Mounting route : ' + route.route + ' to type : ' + transport.title);

	    self.pull_sock.on(route.route, function(event, data) {
		debug('New message', event, data);
		transport.push(event, data);
	    });
	    
	    self.transports.push(transport);
	});
    };

    // Keep the process alive
    var keepItAlive = function() {
	
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
	}
	
	process.on('SIGINT', function (err) {
	    closeConnections('SIGINT received');
	    process.exit();
	});

	process.on('uncaughtException', function (err) {	    
	    closeConnections(err);
	    bindPullSocket();
	    generateRouter();
	});
    };

    function start() {
	bindPullSocket();
	generateRouter();
	
	if (options.keep_it_alive || true)
	    keepItAlive();
    }

    start();
};
