
var debug = require('debug')('MB:transport:axon');
var axon = require('axon');

var AxonForward = module.exports = function(options) {
    this.title = 'AxonForward';    
    debug('Initiating Axon Forward to ip = ' + options.host + ' port = ' + options.port);

    this.push_sock = axon.socket('pub-emitter');
    this.p_sock = this.push_sock.connect(options.port, options.host);
};

AxonForward.prototype.push = function(event, data) {
    this.push_sock.emit(event, data);
};

AxonForward.prototype.close = function() {
    
};
