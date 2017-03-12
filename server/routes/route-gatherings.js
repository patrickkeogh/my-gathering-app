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

    var page = req.query.page ? parseInt(req.query.page) : 1;
    var recsPerPage = req.query.recsPerPage ? parseInt(req.query.recsPerPage) : 5;
    var query = req.query.query ? req.query.query : "";
    var queryObj = JSON.parse(query);

    console.log('################################SEARCH_INFO_OBJECT????:' + queryObj);

    var recsToSkip = ((page - 1) * recsPerPage);

    Gatherings.find(queryObj).sort({"gathering_start_date_time":1}).skip(recsToSkip).limit(recsPerPage)
        .exec(function(err, gatherings) {

            if (err) throw err;

            Gatherings.find(queryObj)
            .count(function(err, count) {
                if (err) throw err;

                var numPages = 0;
                    
                if (count > recsPerPage) {
                    numPages = Math.ceil(count / recsPerPage);
                }                

                var returnObj = {  
                    recCount: count,
                    pages: numPages,
                    page: page,
                    gatherings: gatherings
                };

                //console.log('COUNT################################:' + count);

                res.json(returnObj);

            });

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





module.exports = gatheringRouter;