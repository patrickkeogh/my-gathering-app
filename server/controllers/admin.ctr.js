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

    	sendJSONresponse(res, HTTPStatus.OK, topic);

  	});
};

module.exports.createType = function(req, res) {

	console.log('entered post new gathering type:');

  	var newType = req.body;

  	Topic.create(newType, function(err, type) {

    	if (err) return validationError(res, err);

    	sendJSONresponse(res, HTTPStatus.OK, type);

  	});
};