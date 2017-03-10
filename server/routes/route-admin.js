var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var HTTPStatus = require('http-status');

var Topic = require('../models/topics');
var Type = require('../models/types');


var Verify = require('../config/verify');

var router = express.Router();
router.use(bodyParser.json());

var validationError = function(res, err) {
  return res.json(422, err);
};

//var RECS_PER_PAGE = 5;

router.route('/create/topic')
.post(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

  console.log('entered post new gathering topic:');

  var newTopic = req.body;

  Topic.create(newTopic, function(err, topic) {

    if (err) return validationError(res, err);

    //res.json(gathering);
    var id = topic._id;

    res.writeHead(HTTPStatus.OK, {
      'Content-Type': 'text/plain'
    });

    //res.send(gathering);
    res.end(JSON.stringify({
        topic: topic
    }));

  });
});

router.route('/create/type')
.post(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

  console.log('entered post new gathering type:');

  var newType = req.body;

  Type.create(newType, function(err, type) {

    if (err) return validationError(res, err);

    //res.json(gathering);
    var id = type._id;

    res.writeHead(HTTPStatus.OK, {
      'Content-Type': 'text/plain'
    });

    //res.send(gathering);
    res.end(JSON.stringify({
        type: type
    }));

  });
});



module.exports = router;