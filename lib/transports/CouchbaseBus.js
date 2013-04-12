
var couchbase = require('couchbase');
var debug = require('debug')('MB:transport:couchbase');
var axon = require('axon');

var CouchbaseBus = module.exports = function(options) {
    var self = this;
    
    this.title = 'CouchbaseBus';
    this.hosts = options.hosts || ['127.0.0.1'];
    this.bucket = options.bucket || 'default';
    
    couchbase.connect({
	hosts : this.hosts,
	bucket : this.bucket
    }, function(err, cb) {
	if (err)
	    debug(err);
	debug('Connected to Couchbase');
	self.couchbase = cb;
    });

};

CouchbaseBus.prototype.push = function(event, data) {
    if (this.couchbase == null) {
	debug('Couchbase still not initiated');
	return;
    }
    this.couchbase.append(event, data, function(err, meta) {
	debug(meta);
    });
};

CouchbaseBus.prototype.close = function() {
};
