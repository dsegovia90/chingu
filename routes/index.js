var express = require('express');
var router = express.Router();
var passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chingu PP', slack_id: process.env.SLACK_CLIENT_ID });
});

/* Start slack OAuth flow */
router.get('/auth/slack', passport.authorize('slack'));

/* Slack OAuth callback url */
router.get('/auth/slack/callback', 
  passport.authorize('slack', { failureRedirect: '/login' }),
  (req, res) => {
    console.log(req.body)
    res.redirect('/')
  }
);


module.exports = router;
