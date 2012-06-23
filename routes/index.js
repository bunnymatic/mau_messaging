
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    title: 'Mission Artists United : Messaging',
    FAYE_SERVER_URL: process.env.FAYE_SERVER_URL || "http://localhost:3030/maumessages",
    SUBSCRIBER_TOKEN: process.env.SUBSCRIBER_TOKEN || "whatevs_yo"
  });
};