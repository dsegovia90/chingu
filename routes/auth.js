var express = require('express');
var router = express.Router();
var passport = require('passport');

/* Start slack OAuth flow */
router.get('/slack', passport.authenticate('slack'));

/* Slack OAuth callback url */
router.get('/slack/callback',
  passport.authenticate('slack', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
