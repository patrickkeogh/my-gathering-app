var passport = require('passport');
var User = require('../models/users');
var Verify = require('../config/verify');
var HTTPStatus = require('http-status');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var validationError = function(res, err) {
  return res.json(422, err);
};

module.exports.register = function(req, res) {

  User.findOne({username: req.body.username}, function (err, user) {

    console.log("REGISTER HAS BEEN CALLED");

    if (err) return validationError(res, err);

    if(user) {
      console.log("we have a user with this username");
      return res.status(HTTPStatus.BAD_REQUEST).json({err: 'The supplied email address has already be used to register!'});

    }else{

      User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {


          if (err) return validationError(res, err);

          if(req.body.name) {
              user.name = req.body.name;
          }
          
          if(req.body.firstname) {
              user.firstname = req.body.firstname;
          }

          if(req.body.lastname) {
              user.lastname = req.body.lastname;
          }

          if(req.body.admin) {
            user.admin = req.body.admin;
          }
          
          user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {

            return res.status(200).json({status: 'Registration Successful!'});
                        
          });
        });
      });

    }

  });

};

module.exports.login = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken(user);

      console.log("UserInfo from loggedin User:" + user);
      
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        _id: user._id,
        name: user.name
      });
    });
  })(req,res,next);

};

module.exports.logout = function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
};
