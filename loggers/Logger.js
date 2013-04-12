//     __  _______
//    /  |/  / __ )
//   / /|_/ / __  |
//  / /  / / /_/ /
// /_/  /_/_____/
//

var axon = require('axon'); 

exports.getLogger = function(name) {
    return Logger.buildLogger(name);
};

exports.init = function(opts) {
    Logger.init(opts);
};

var Logger = {
    init : function(options) {
	if (typeof options == 'undefined')
	    options = {};

	this.display = options.display || true;
	this.remote = options.remote || false;

	this.port = options.port || 3000;
	this.ip = options.ip || '127.0.0.1';
	
	this.sock = axon.socket('pub-emitter');
	
	this.events = this.sock.connect(this.port, this.ip);

	return this;
    },
    // for custom events
    send : function(event, msg) {
	this.sock.emit(event, msg);
    },
    // Logger Factory
    buildLogger : function(name) {
	var self = this;

	return function(msg) {
	    if (self.display)
		console.log('[' + name + '] ', msg); 
	    self.send(name, msg);
	};
    }
};

exports.log = Logger;
