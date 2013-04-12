
var axon = require('axon');
var debug = require('debug')('MB:transport:console');
var postal = require('postal');

var ConsoleBus = module.exports = function(options) {
    this.title = 'ConsoleBus';
};

ConsoleBus.prototype.push = function(event, data) {
    console.log(event, data);
};

ConsoleBus.prototype.close = function() {
    console.log('Closing');
};
