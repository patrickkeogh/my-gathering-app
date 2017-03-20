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

module.exports.getGatherings = function(req, res) {

  var page = req.query.page ? parseInt(req.query.page) : 1;
  
  var recsPerPage = req.query.recsPerPage ? parseInt(req.query.recsPerPage) : 5;
  //console.log('recsPerPage################################:' + recsPerPage);

  var query = req.query.query ? req.query.query : "";

  //console.log('################################QUERY:' + query);
  var queryObj = JSON.parse(query);

  //console.log('################################SEARCH_INFO_OBJECT????:' + queryObj);

  var recsToSkip = ((page - 1) * recsPerPage);

  Gatherings.find(queryObj).sort({_id:1}).exec(function(err, gatherings) {

      if (err) throw err;
      sendJSONresponse(res, HTTPStatus.OK, gatherings);

  });

  // Gatherings.find(queryObj, function (err, gatherings) {
  //     if (err) throw err;
  //     sendJSONresponse(res, HTTPStatus.OK, gatherings);
  // });

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

module.exports.addBanner = function(req, res) {
  var banner = {
        banner: req.body
    };
    
    var id = req.params.id;

    Gatherings.findByIdAndUpdate(id, banner, function(err, gathering) {

        if (err) throw err;
       sendJSONresponse(res, HTTPStatus.OK, gathering);


    });


};

module.exports.createGathering = function(req, res) {
  console.log('entered post new gathering:');

  var newGathering = req.body;
  //newGathering.name = "Steve";
  //newGathering.description = "Steve";
  //newGathering.location = "Steve";
  //newGathering.directions = "Steve";
  //newGathering.notes = "Steve";
  //newGathering.owner_id = 1;
  //newGathering.gathering_date = new Date();    
  //newGathering.gathering_time = new Date();
  //newGathering.access = "private";
  //newGathering.status = "active";

  //newGathering.createDate = new Date();
  //newGathering.name = "bOB";

  


  //console.log("gatheringDateAndTime%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:" + newGathering.gathering_date_time);
  //console.log("createdDatAndTime%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:" + newGathering.createDate);

  //console.log("gatheringinfo on server=" + str);

  Gatherings.create(newGathering, function (err, gathering) {

    if (err) {
      console.log('Error:' + err);
      throw err;
    } 

    sendJSONresponse(res, HTTPStatus.OK, gathering);
  });


};

