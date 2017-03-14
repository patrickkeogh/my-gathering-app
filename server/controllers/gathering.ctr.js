var HTTPStatus = require('http-status');

// Bring in the required models
var Gatherings = require('../models/gatherings');
var Topic = require('../models/topics');
var Type = require('../models/types');


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var validationError = function(res, err) {
  return res.json(422, err);
};

module.exports.getTopics = function(req, res) {

	Topic.find({}, {_id: 1}).sort({_id:1}).exec(function(err, topics) {

    if (err) throw err;
    sendJSONresponse(res, HTTPStatus.OK, topics);

  });

};

module.exports.getTypes = function(req, res) {

  Type.find({}, {_id: 1}).sort({_id:1}).exec(function(err, types) {

    if (err) throw err;
    sendJSONresponse(res, HTTPStatus.OK, types);

  });

};

