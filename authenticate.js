var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



}));

// exports.local = passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// var FacebookStrategy = require('passport-facebook').Strategy;

// exports.facebook = passport.use(new FacebookStrategy({
//   clientID: config.facebook.clientID,
//   clientSecret: config.facebook.clientSecret,
//   callbackURL: config.facebook.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {

//   	if (!profile.emails || !profile.emails.length) {
//     	return done('No emails associated with this account!');
//     }

//     User.findOne({ OauthId: profile.id }, function(err, user) {
//       if(err) {
//         console.log(err); // handle errors!
//       }
//       if (!err && user !== null) {
//         done(null, user);
//       } else {
//         user = new User({
//           username: profile.emails[0].value
//         });
//         user.name = profile.displayName;
//         user.OauthId = profile.id;
//         user.OauthToken = accessToken;
//         user.picture = 'http://graph.facebook.com/' + profile.id.toString() + '/picture?type=large';

//         user.save(function(err) {
//           if(err) {
//             console.log(err); // handle errors!
//           } else {
//             console.log("saving user ...");
//             done(null, user);
//           }
//         });
//       }
//     });
//   }
// ));


 // Facebook-specific
// exports.facebook = passport.use(new FacebookStrategy(
//     {
//       clientID: config.facebook.clientID,
//       clientSecret: config.facebook.clientSecret,
//       callbackURL: config.facebook.callbackURL,
//       profileFields: ['id', 'emails', 'name']
//     },
//     function(accessToken, refreshToken, profile, done) {
//       if (!profile.emails || !profile.emails.length) {
//         return done('No emails associated with this account!');
//       }

//       User.findOneAndUpdate(
//         { OauthId: profile.id },
//         {
//           $set: {
//             'username': profile.emails[0].value,
//             'OauthId': profile.id,
//             'OauthToken': accessToken,
//             'picture': 'http://graph.facebook.com/' +
//               profile.id.toString() + '/picture?type=large'
//           }
//         },
//         { 'new': true, upsert: true, runValidators: true },
//         function(error, user) {
//           done(error, user);
//         });
//     }));