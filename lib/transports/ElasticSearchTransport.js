
var elastical = require('elastical');
var debug = require('debug')('MB:transport:elastical');


var ElasticSearchTransport = module.exports = function(options) {
    this.title = 'ElasticSearchTransport';

    this.dbClient = new elastical.Client(options.host || '127.0.0.1', { port : options.port || 9200 });
};


ElasticSearchTransport.prototype.push = function(event, data) {
    data['_key'] = event;
    this.dbClient.index('afflux', 'afflux', data); 
};

ElasticSearchTransport.prototype.close = function(event, data) {
};
