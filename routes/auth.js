var express = require('express');
var router = express.Router();
var passport = require('passport');
var slack = require('slack')
var Team = require('../models/teams.js')

/* Start slack OAuth flow */
router.get('/slack', passport.authenticate('slack'));

/* Slack OAuth callback url */
router.get('/slack/callback',
  passport.authenticate('slack', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/slack/install', function (req, res) {
  var client_id = process.env.SLACK_CLIENT_ID;
  var client_secret = process.env.SLACK_CLIENT_SECRET;
  var code = req.query.code;
  var redirect_uri = 'http://localhost:3000/auth/slack/install'
  slack.oauth.access({ client_id, client_secret, code, redirect_uri }, (err, data) => {
    if(err){
      console.error(err);
    }
    console.log(data)
    
    res.redirect('/login')
  })
})

module.exports = router;
