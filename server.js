var http = require('http'),
  faye = require('faye'),
  express = require('express'),
  routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);


/*** Setup Faye Server */
var bayeux = new faye.NodeAdapter({mount:'/maumessages'});
/* setup security */
var serverAuth = {
  incoming: function(msg, cb) {
    console.log(msg);
    if (msg.channel === '/meta/subscribe') {
      var subscriberToken = msg.ext && msg.ext.subscriberToken;
      if (subscriberToken !== (process.env.CLIENT_SUBSCRIBER_AUTH_TOKEN || 'whatevs_yo')) {
        msg.error = 'Invalid subscription auth token ' + subscriberToken;
      }
    }
    cb(msg);
  }
};

bayeux.addExtension(serverAuth);
bayeux.attach(app);

port = process.env.PORT || 3030;

app.listen(port, function(){
  console.log("MAU Messaging is live and direct on port %d in %d mode",port, app.settings.env);
});
