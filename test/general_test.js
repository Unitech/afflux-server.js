'use strict';

var MB = require('..');

describe('Test server', function() {
    
    describe('Test basics', function() {
	it('should be ok', function() {
            MB.should.be.ok;	
	});
    });

    describe('Instancy', function() {
	var mb;
	
	before(function() {
	    mb = new MB({
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
	});

	it('be an object and have close method', function() {
	    mb.should.be.a('object');
	    mb.close();
	});

	it('should throw error if transport unknown', function() {
	    (function() {
		var mb2 = new MB({
		    log_port : 9995,
		    keep_it_alive : true,
		    router : [{
			route : 'api:*',
			store : 'Unknown'
		    }]
		});
	    }).should.throw('Transport Unknown undefined');
	});
    });
});
