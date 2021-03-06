$(function() {

  /** if you do not specify the port here, this will try to use the
      client port and communication with the server may fail */
  var subscription;

  /** server url is spec'd by the app config in the view */
  var host = location.host;
  if (!(/:\d+/.test(host))) {
    host += ":80";
  }
  var server_uri = location.protocol + "//" + host + "/maumessages";
  var client = new Faye.Client(server_uri);
  var clientAuth = {
    outgoing: function(msg, cb) {
      if (msg.channel === '/meta/subscribe') {
        msg.ext = msg.ext || {};
        msg.ext.subscriberToken = SUBSCRIBER;
      }
      cb(msg);
    }
  };
  /* heroku doesn't like websocket */
  client.disable('websocket');
  client.addExtension(clientAuth);
  var num_messages_to_show = 15;
  var subscribe = function(channel) {
    if(subscription) {
      subscription.cancel();
    }
    subscription = client.subscribe(channel,  function(msg) {
      var today = new Date();
      var new_el = $('<li>', {"class":"new clearfix"});
      var date = $('<div>', {"class":"date"}).html(today.format());
      var msg_block = $('<div>',{"class":"info"});
      var flds = ['env','path','text'];
      console.log(msg);
      $.each(flds, function(idx, key) {
        msg_block.append($('<div>', {"class":key}).html(msg[key]));
      });
      new_el.append(date).append(msg_block);
      $('#messages').prepend(new_el);
      var elements = $('#messages li').slice(1).removeClass("new");
      $(elements.slice(num_messages_to_show).get().reverse()).each(function() {
        $(this).fadeOut(function() { $(this).remove(); });
      });
    });
    subscription.callback(function() {
      $('.channels').html('You\'re listenin to channel: '+ channel);
    });
  };

  subscribe('/**');
});