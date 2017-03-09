var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passportLocalMongoose = require('passport-local-mongoose');

var config = require('../../config');

var userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      lowercase: true
    },
    picture: {
      type: String,
      // required: true,
      match: /^https:\/\//i
    },
    name: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    hasLoggedIn: {
      type: Boolean,
      default: false
    },
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

// userSchema.methods.setPassword = function(password){
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
// };

// userSchema.methods.validPassword = function(password) {
//   var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
//   return this.hash === hash;
// };



userSchema.path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({
      username: value
    }, function(err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified email address is already in use.');

// userSchema.methods.generateJwt = function() {
//   var expiry = new Date();
//   expiry.setDate(expiry.getDate() + 7);

//   return jwt.sign({
//     _id: this._id,
//     email: this.email,
//     name: this.name,
//     exp: parseInt(expiry.getTime() / 1000),
//   }, config.secretKey); // DO NOT KEEP YOUR SECRET IN THE CODE!
// };

userSchema.plugin(passportLocalMongoose);

mongoose.model('User', userSchema);