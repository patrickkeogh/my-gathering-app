var HTTPStatus = require('http-status');

var Topic = require('../models/topics');
var Type = require('../models/types');


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var validationError = function(res, err) {
  return res.json(422, err);
};

module.exports.createTopic = function(req, res) {

	console.log('entered post new gathering topic:');

  	var newTopic = req.body;

  	Topic.create(newTopic, function(err, topic) {

    	if (err) return validationError(res, err);

    	//res.json(gathering);
    	var id = topic._id;

    	sendJSONresponse(res, HTTPStatus.OK, topic);

    	// res.writeHead(, {
     //  	'Content-Type': 'text/plain'
    	// });

    	// res.end(JSON.stringify({
     //    	topic: topic
    	// }));

  	});


};