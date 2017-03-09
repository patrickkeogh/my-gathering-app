var express = require('express');
var router = express.Router();

var verify = require('../../verify');

var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/auth');

// profile
router.get('/profile', verify, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/logout', ctrlAuth.logout);

module.exports = router;