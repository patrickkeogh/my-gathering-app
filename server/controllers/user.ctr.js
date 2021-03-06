var passport = require('passport');
var User = require('../models/users');
var Verify = require('../config/verify');
var HTTPStatus = require('http-status');

var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'views/templates');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var Jade = require('jade');

var transporter = nodemailer.createTransport(smtpTransport({
  host: 'chakra.websitewelcome.com',
  port: 465,
  auth: {
      user: 'patrickkeogh@kantechprogramming.com',
      pass: 'thekkoyk1'
  }
}));

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var validationError = function(res, err) {
  return res.json(422, err);
};

module.exports.register = function(req, res) {

  console.log("REGISTER HAS BEEN CALLED:" + req.body.username);

  User.findOne({username: req.body.username}, function (err, user) {

    console.log("findOne HAS BEEN CALLED:");

    if (err) return validationError(res, err);

    if(user) {
      console.log("we have a user with this username");
      return res.status(HTTPStatus.BAD_REQUEST).json({success: false, status: 'The supplied email address has already be used to register!'});

    }else{
      console.log("Register a new user:");

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

            var locals = {name:req.body.name, password:req.body.password};
            //var html   = Jade.renderFile('./views/templates/register.jade', locals);

            var html = "<h1>My Gathering Registration</h1>";
            html += "<p>Hello " + req.body.name + ", thank you for registering with MyGathering.com</p>";
            html += "<p>Your temporary password to access the site is: " + req.body.password + "</p>";
            html += "<p>This password should be changed the first time you sign in.</p>";


            var mailOptions = {
              from: 'info@kantechprogramming.com',
              to: req.body.username,
              subject: 'MyGathering.com Registration Confirmation',
              html: html
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if(error){
                console.log(error);
                //res.json({yo: 'error'});
              }else{
                console.log('message sent:' + info.response);
                //res.json({yo: info.response});
              }


            });



            return res.status(HTTPStatus.OK).json({success: true, status: 'Registration Successfull!'});
                      
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
      return res.status(HTTPStatus.UNAUTHORIZED).json({
        status: info.message,
        success: false
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
          status: 'Could not log in user',
          success: false
        });
      }
        
      var token = Verify.getToken(user);

      console.log("UserInfo from loggedin User:" + user);
      
      res.status(HTTPStatus.OK).json({
        status: 'You have successfully logged in.',
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
  res.status(HTTPStatus.OK).json({
    status: 'You have signed out. Bye!'
  });
};
