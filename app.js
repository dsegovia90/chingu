var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var SlackStrategy = require('passport-slack').Strategy
var passport = require('passport')
var session = require('express-session')
var mongoose = require('mongoose')
require('dotenv').config()

var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize mongoose with the .env variable
mongoose.connect(process.env.MONGO_URI)
// mongoose.Promise = global.Promises

// Used to keep session during page changes
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}))

// Point to the passport config file
require('./config/passport.js')(passport)
app.use(passport.initialize());
app.use(passport.session())

//subapps
app.use('/', index);
app.use('/admin', admin); //for future development

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
