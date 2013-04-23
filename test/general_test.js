

var MB = require('..');

var axon = require('axon');
var Emitter = require('events').EventEmitter;

var AxonClient = {
	init : function(port) {
		this.sock = axon.socket('pub-emitter');
		this.events = this.sock.connect(port, '127.0.0.1');
	},
	send : function(event, msg) {
		this.sock.emit(event, msg);
	}
};



var AffluxListener = function(options) {
	var self = this;

	this.pull_sock = axon.socket('sub-emitter');

	this.events = this.pull_sock.bind(options.port);

	this.emit('ok', {msg : 'asdsad'});

	this.pull_sock.on('*', function(event, data) {
		self.emit('message', {event : event, data : data});
	});
};


AffluxListener.prototype.__proto__ = Emitter.prototype;


const AXON_PORT = 19997;

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
				axon_port : AXON_PORT,
				keep_it_alive : false,
				rpc_port : 9994,
				router : [{
					route : '#',
					dest : 'ConsoleTransport'
				},{
					route : 'carcass:*',
					dest : 'ConsoleTransport'
				}]
			});
		});

		it('be an object and have close method', function() {
			mb.should.be.a('object');
			mb.close();
		});

		it.skip('should throw error if transport unknown', function(done) {
			(function() {
				var mb2 = new MB({
					axon_port : AXON_PORT,
					keep_it_alive : false,
					router : [{
						route : 'api:*',
						dest : 'Unknown'
					}]
				});
			}).should.throw();
			done();
		});
	});

	describe('Message interactions with client and AxonForward', function() {
		var mb;
		var listener;
		var listenerTwo;

		before(function() {
			mb = new MB({
				axon_port : AXON_PORT,
				rpc_port : 3333,
				router : [{
					route : '#',
					dest : 'AxonForward',
					conf : {
						port : AXON_PORT + 1,
						host : '127.0.0.1'
					}
				},{
					route : 'routed:*',
					dest : 'AxonForward',
					conf : {
						port : AXON_PORT + 2,
						host : '127.0.0.1'
					}
				}]
			});
			listener = new AffluxListener({port : AXON_PORT + 1})
			listenerTwo = new AffluxListener({port : AXON_PORT + 2})
			AxonClient.init(AXON_PORT);
		});

		it('should receive message from Axon port', function (done) {
			var dataSample = {event : "toto:blabla", msg : {msg : 'data'}};

			listener.once('message', function(data) {
				data.event.should.eql(dataSample.event);
				data.data.should.eql(dataSample.msg);
				done();
			})

			// add event emitter to axon client
			setTimeout(function() {
				AxonClient.send(dataSample.event, dataSample.msg);
			}, 200)
		
		});

		it('should receive data on route 2', function (done) {
			var dataSample = {event : "routed:blabla", msg : {msg : 'data'}};

			listenerTwo.once('message', function(data) {
				data.event.should.eql(dataSample.event);
				data.data.should.eql(dataSample.msg);
				done();
			});

			// add event emitter to axon client
			setTimeout(function() {
				AxonClient.send(dataSample.event, dataSample.msg);
			}, 200)			
		});
	})
});









