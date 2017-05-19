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

module.exports.getGatheringPojo = function(req, res) {
  console.log('entered getGatheringPojo:');

  Gatherings.find({}, {_id:1, name:1, description:1, type:1 }).exec(function(err, gatherings) {

      if (err) throw err;
      sendJSONresponse(res, HTTPStatus.OK, gatherings);

  });



};



