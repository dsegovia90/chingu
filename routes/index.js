var express = require('express');
var router = express.Router();
var passport = require('passport');

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

router.get('/logout', isLoggedIn, function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
