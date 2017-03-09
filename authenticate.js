var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./server/models/users');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var FacebookStrategy = require('passport-facebook').Strategy;

exports.facebook = passport.use(new FacebookStrategy({
	clientID: config.facebook.clientID,
  	clientSecret: config.facebook.clientSecret,
  	callbackURL: config.facebook.callbackURL,
  	profileFields: ['id', 'emails', 'name', 'displayName']

}, function(accessToken, refreshToken, profile, done) {

	console.log("FACEBOOK FIELDS RETURNED:" + JSON.stringify(profile));

	if (!profile.emails || !profile.emails.length) {
   		return done('No emails associated with this account!');
   	}

   	process.nextTick(function() {

   		// find the user in the database based on their facebook id
      	User.findOne({ 'id' : profile.id }, function(err, user) {

      		//if there is an error, stop everything and return that
	        // ie an error connecting to the database
	        if (err) {
	        	console.log(err); // handle errors!
	        	return done(err);
	        }

	        // if the user is found, then log them in
	        if (!err && user !== null) {
	          	console.log("WE ALREADY HAVE A USER WITH THIS ID THROUGH FACEBOOK:" + profile.displayName);
	            return done(null, user); // user found, return that user
	        } else {
	            // if there is no user found with that facebook id, create them
	            user = new User({
		          	username: profile.emails[0].value
		        });
				
				// set all of the facebook information in our user model
		        user.OauthId = profile.id;
		        user.OauthToken = accessToken;
		        user.name = profile.displayName;
		        user.picture = 'https://graph.facebook.com/' + profile.id.toString() + '/picture?type=large';
	 
	            user.firstName  = profile.name.givenName;
	            user.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
	            //newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
	 
	            // save our user to the database
	            user.save(function(err) {
		          	if(err) {
		            	console.log(err); // handle errors!
		          	} else {
		            	console.log("saving user ...");
		            	done(null, user);
		          	}
	        	}); //user.save

	        } //end if




      	}); //user.findOne

   	}); //process.tick

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