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

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){

    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(HTTPStatus.NOTFOUND).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(HTTPStatus.OK);
      res.json({
        "token" : token,
        "user": user,
        "status": 'Login Successful!'
      });
    } else {
      // If user is not found
      res.status(HTTPStatus.UNAUTHORIZED).json(info);
    }
  })(req, res);

};

module.exports.logout = function(req, res) {
  req.logout();
  res.status(HTTPStatus.OK).json({
    "status": 'Logout Successful!'
  });
};
