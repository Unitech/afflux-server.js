
var rpc = require('axon-rpc')
  , axon = require('axon')
  , req = axon.socket('req');

var client = new rpc.Client(req);
req.connect(3055);


client.call('push_msg', 'my:event', {dt : 'ok'}, function(err) {
    console.log(arguments);
});
