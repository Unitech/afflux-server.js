
var redis = require('redis');
var debug = require('debug')('MB:transport:redis');
var axon = require('axon');

var RedisBus = module.exports = function(options) {
    this.title = 'RedisBus';
    this.dbClient = redis.createClient(options.port || 6379,
				       options.host || '127.0.0.1');

    this.dbClient.on('ready', function(err) {
	debug('Connected to redis');
    });
    
    this.dbClient.on('error', function(err) {
	debug(err);
    });
};


RedisBus.prototype.push = function(event, data) {
    this.dbClient.lpush(event, JSON.stringify(data));
};

RedisBus.prototype.close = function(event, data) {
    this.dbClient.quit();
};
