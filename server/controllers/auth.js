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

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) return validationError(res, err);

    var token;
    token = user.generateJwt();
    res.status(HTTPStatus.OK);
    res.json({
        "status": 'Registration Successful!'
      });
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
