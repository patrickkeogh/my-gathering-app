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

module.exports.getGatherings = function(req, res) {
  console.log('entered getGatherings() Mobile:');

  var queryFields = req.body;

  var query = {};

  if(req.body.distance) {
    console.log('WE HAVE A DISTANCE:' + req.body.distance);
  }



  if(req.body.coordinates !== null){

    query['location.location'] = {
      $near: {
        $geometry: { type: "Point",  coordinates: req.body.coordinates },
        $minDistance: 0.01,
        $maxDistance: req.body.distance
      }
    };



  }

  if(req.body.distance) {
    console.log('WE HAVE A DISTANCE:' + req.body.distance);

  }else{
    console.log('WRONG NO DISTANCE:' + req.body.distance);

  }

  console.log('QueryFieldsMobile:' + JSON.stringify(queryFields));

  Gatherings.find().limit(100).exec(function(err, gatherings) {

      if (err) throw err;
      sendJSONresponse(res, HTTPStatus.OK, gatherings);

  });

};

module.exports.getGathering = function(req, res) {

  console.log('Route Found');
  var id = req.params.id;

  Gatherings.find({_id:id}, function(err, gathering) {

    if (err) {
        console.log('Error:' + err);
        throw err;
    } 

    sendJSONresponse(res, HTTPStatus.OK, gathering);


  });

};



