
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    title: 'Mission Artists United : Messaging',
    SUBSCRIBER: process.env.CLIENT_SUBSCRIBER_AUTH_TOKEN || "whatevs_yo"
  });
};