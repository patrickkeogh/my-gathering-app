var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Gatherings = require('../models/gatherings');
var Topic = require('../models/topics');
var Type = require('../models/types');

var Verify = require('../config/verify');

var validationError = function(res, err) {
  return res.json(422, err);
};

var gatheringRouter = express.Router();
gatheringRouter.use(bodyParser.json());

//var RECS_PER_PAGE = 5;

gatheringRouter.route('/')
.get(function (req, res, next) {

    //1console.log('req.query################################:' + JSON.stringify(req));

    var page = req.query.page ? parseInt(req.query.page) : 1;
    
    var recsPerPage = req.query.recsPerPage ? parseInt(req.query.recsPerPage) : 5;
    console.log('recsPerPage################################:' + recsPerPage);

    var query = req.query.query ? req.query.query : "";

    console.log('################################QUERY:' + query);
    var queryObj = JSON.parse(query);

    console.log('################################SEARCH_INFO_OBJECT????:' + queryObj);

    var recsToSkip = ((page - 1) * recsPerPage);

    // Gatherings.find(queryObj}, {_id: 1}).sort({_id:1}).exec(function(err, gatherings) {

    //     if (err) throw err;
    //     res.json(gatherings);

    // });

    Gatherings.find(queryObj, function (err, gatherings) {
        if (err) throw err;
        res.json(gatherings);
    });
})


.post(Verify.verifyOrdinaryUser, function (req, res, next) {
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
        if (err) throw err;


        

        var id = gathering._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        //res.send(gathering);
        res.end(JSON.stringify({
            id: id
        }));
    });
});

gatheringRouter.route('/type')
.get(function(req, res, next) {

  Type.find({}, {_id: 1}).sort({_id:1}).exec(function(err, types) {
        if (err) throw err;
        res.json(types);

    });


});

gatheringRouter.route('/topic')
.get(function(req, res, next) {

  Topic.find({}, {_id: 1}).sort({_id:1}).exec(function(err, topics) {
        if (err) throw err;
        res.json(topics);

    });


});

gatheringRouter.route('/:id')
.get(function(req, res, next) {

    Gatherings.find({_id:id}, function(err, gathering) {

        if (err) {
            console.log('Error:' + err);
            throw err;
        } 

        // console.log('Gathering banner updated!');
        // str = JSON.stringify(gathering);
        // console.log('Gathering After Picture Added:' + str);


        res.json(gathering);


    });


});

gatheringRouter.route('/banner/:id')
.post(function (req, res, next) {

    str = JSON.stringify(req.body);

    console.log('Location Info:' + str);

    var banner = {
        banner: req.body
    };
    
    var id = req.params.id;

    Gatherings.findByIdAndUpdate(id, banner, function(err, gathering) {

        if (err) throw err;
        console.log('Gathering banner updated!');
        str = JSON.stringify(gathering);
        console.log('Gathering After Picture Added:' + str);


        var id = gathering._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Updated the banner for the gathering with id: ' + id);


    });
});





module.exports = gatheringRouter;