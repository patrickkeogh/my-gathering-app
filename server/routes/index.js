var express = require('express');
var router = express.Router();

//var verify = require('../../verify');

//var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/user.ctr');
var ctrlAdmin = require('../controllers/admin.ctr');

// c
//router.get('/profile', verify.verifyOrdinaryUser, ctrlProfile.profileRead);

// authentication routes
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/logout', ctrlAuth.logout);

router.post('/admin/topic', ctrlAdmin.createTopic);

module.exports = router;