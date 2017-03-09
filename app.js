// Auto installed with express generator
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Manually installed with npm
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
//var flash    = require('connect-flash');

//var routes = require('./routes/index');
var users = require('./routes/route-users');
//var gatherings = require('./routes/route-gathering');
//var categories = require('./routes/route-category');

// Add the config file 
var config = require('./config');

// Connect to Mongo DB Server
mongoose.connect(config.mongoUrlForHeroku);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to mongo server");
});

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');

    next();
};

var app = express();

// Secure traffic only
// app.all('*', function(req, res, next){
//     console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
//   if (req.secure) {
//     return next();
//   }

//  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(require('express-session')({ secret: 'kantechprogrammingisthebest', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
//app.use(passport.session()); // persist login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static(path.join(__dirname, 'bower_components')));

//app.use('/', routes);
app.use('/api', users);
//app.use('/gathering', gatherings);
//app.use('/category', categories);



app.use(bodyParser.json({ reviver: function(key, value) {
  if ( typeof value === 'string' && value.length === 24) {
    if (value.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/)){
      return new Date(value);
    }
  }
  return value;
}}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;