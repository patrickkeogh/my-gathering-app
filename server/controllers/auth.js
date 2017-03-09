var HTTPStatus =  require('http-status');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

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

    if (err) throw err;

    if(user) {
      console.log("we have a user with this username");
      return res.status(500).json({err: 'Username is not Unique!'});

    }else{

      User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {


          if (err) {
              return res.status(500).json({err: err});
          }

          if(req.body.name) {
              user.name = req.body.name;
          }
          
          if(req.body.firstname) {
              user.firstname = req.body.firstname;
          }

          if(req.body.lastname) {
              user.lastname = req.body.lastname;
          }
          
          user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {

              var locals = {name:req.body.name, password:req.body.password};
              var html   = Jade.renderFile('./views/templates/register.jade', locals);

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

            return res.status(200).json({status: 'Registration Successful!'});
                        
          });
        });
      });

    }

  });

};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info) {

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(HTTPStatus.UNAUTHORIZED).json({
        err: info
      });
    }

    req.logIn(user, function(err) {

      if (err) {
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
          error: err,
          message: 'Could not log use in'
        });
      }
        
      var token = Verify.getToken(user);

      console.log("UserInfo from loggedin User:" + user);
      
      res.status(HTTPStatus.OK).json({
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
  res.status(HTTPStatus.OK).json({
    "status": 'Logout Successful!'
  });
};
