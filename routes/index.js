var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

router.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chingu PP', slack_id: process.env.SLACK_CLIENT_ID });
});

/* Start slack OAuth flow */
router.get('/auth/slack', passport.authenticate('slack'));

/* Slack OAuth callback url */
router.get('/auth/slack/callback',
  passport.authenticate('slack', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

/* Handle form submission - create/update request for partner */
router.post('/create-request', isLoggedIn, function(req, res) {
  // TODO: check for a match!!!
  User.findOneAndUpdate({_id: res.locals.user}, { $set: {
    pending: {
      created: Date.now()
    }
  } }, function(err, doc) {
    if (err) {
      console.log(err);
      message = "Oops! There was an error processing your application.";
    }
    else {
      message = "Thank you for applying for a pair programming parter!";
    }
    res.render('index', {
      title: 'Chingu PP',
      slack_id: process.env.SLACK_CLIENT_ID,
      message: message
    });
  });
});

/* Handle form submission - cancel request for partner */
router.post('/cancel-request', isLoggedIn, function(req, res) {
  User.findOneAndUpdate({_id: res.locals.user}, { $unset: {pending: ""} }, function(err, doc) {
    var message;

    if (err) {
      console.log(err);
      message = "Oops! There was an error canceling your request.";
    }
    else {
      message = "Your request for a pair programming partner has been cancelled.";
    }
    res.render('index', {
      title: 'Chingu PP',
      slack_id: process.env.SLACK_CLIENT_ID,
      message: message
    });
  });
});

router.get('/logout', isLoggedIn, function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
