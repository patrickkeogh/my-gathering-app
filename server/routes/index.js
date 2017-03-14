var express = require('express');
var router = express.Router();

var Verify = require('../config/verify');

// Bring in the controllers
var ctrlAuth = require('../controllers/user.ctr');
var ctrlAdmin = require('../controllers/admin.ctr');
var ctrlGatherings = require('../controllers/gathering.ctr');


// authentication routes
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/logout', ctrlAuth.logout);

// Admin routes
router.post('/admin/topic', Verify.verifyOrdinaryUser, Verify.verifyAdminUser, ctrlAdmin.createTopic);
router.post('/admin/type', Verify.verifyOrdinaryUser, Verify.verifyAdminUser, ctrlAdmin.createType);

// Gathering routes
router.get('/gathering/topics', ctrlGatherings.getTopics);
router.get('/gathering/types', ctrlGatherings.getTypes);

router.get('/gathering', ctrlGatherings.getGatherings);




module.exports = router;