var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Topic = require('../models/topics');


var Verify = require('../config/verify');

var router = express.Router();
router.use(bodyParser.json());

//var RECS_PER_PAGE = 5;

router.route('/create/topic')
.post(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

  console.log('entered post new gathering topic:');

  var newTopic = req.body;

  Topic.create(newTopic, function(err, topic) {

    if (err) throw err;
    console.log('Gathering Topic created!');
    console.log('Gathering Topic:' + JSON.stringify(topic));

    //res.json(gathering);
    var id = topic._id;

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    //res.send(gathering);
    res.end(JSON.stringify({
        topic: topic
    }));


  });



});



module.exports = router;