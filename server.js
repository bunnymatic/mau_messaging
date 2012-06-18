var http = require('http'),
  faye = require('faye');

var bayeux = new faye.NodeAdapter({mount:'/maumessages'});

port = process.env.PORT || 3030;

var html = "<!doctype html><html><head><style>body, div {font-family: sans-serif; background: #101010; color: #999; font-size: 100px;}</style></head><body><div style='margin: 200px;'>Go make some art.</div></body></html>";

var server = http.createServer(function(req,res) {
  res.writeHead(200, {'content-type': 'text/html'});
  res.write(html);
  res.end();
});

console.log("MAU Messaging is live and direct on port " + port);

/* setup security */
var serverAuth = {
  incoming: function(msg, cb) {
    if (msg.channel === '/meta/subscribe') {
      var subscriberToken = msg.ext && msg.ext.subscriberToken;
      if (subscriberToken !== (process.env.CLIENT_SUBSCRIBER_AUTH_TOKEN || 'whatevs_yo')) {
        msg.error = 'Invalid subscription auth token ' + authToken;
      }
    }
    cb(msg);
  }
};

bayeux.addExtension(serverAuth);
bayeux.attach(server);

server.listen(port);
