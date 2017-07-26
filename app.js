const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
require('dotenv').config();

const index = require('./routes/index');
const admin = require('./routes/admin');

const app = express();

const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI,
    collection: 'userSessions',
  });

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
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = require('bluebird');

// Used to keep session during page changes
app.use(session({
  secret: 'This is our secret.',
  resave: false,
  saveUninitialized: true,
  store,
}));

// Point to the passport config file
require('./config/passport.js')(passport);

app.use(passport.initialize());
app.use(passport.session());

// subapps
app.use('/', index);
app.use('/admin', admin); // for future development

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
