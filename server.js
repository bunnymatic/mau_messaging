var http = require('http'),
    faye = require('faye'),
    express = require('express'),
    routes = require('./routes'),
    http= require('http'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler');

var app = express();
var server = http.createServer(app);

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(bodyParser.json())
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

if ('development' == app.get("env")) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
if ('production' == app.get('env')) {
  app.use(errorHandler());
}

// Routes
app.get('/', routes.index);


/*** Setup Faye Server */
var bayeux = new faye.NodeAdapter({mount:'/maumessages'});
/* setup security */
var serverAuth = {
  incoming: function(msg, cb) {
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
bayeux.attach(server);

port = process.env.PORT || 3030;

app.listen(port, function(){
  console.log("MAU Messaging is live and direct on port %d in %d mode",port, app.settings.env);
});
