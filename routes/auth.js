const express = require('express');

const router = express.Router();
const passport = require('passport');
const slack = require('slack');
const Team = require('../models/teams');

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
  var redirect_uri = process.env.INSTALL_URI;

  let dataPromise = new Promise((resolve, reject) => {
    slack.oauth.access({ client_id, client_secret, code, redirect_uri }, (err, data) => {
      resolve(data);
      reject(err);
    })
  })

  dataPromise.then((data) => {
    return Promise.all([Team.findOne({accessToken: data.access_token}), data])
  }).then(([team, data]) => {
    if(!team){
      team = new Team(); // Team didn't exist.
    }
    team.accessToken = data.access_token;
    team.scope = data.scope;
    team.userId = data.user_id;
    team.teamName = data.team_name;
    team.teamId = data.team_id;
    team.bot = {
      bot_user_id: data.bot.bot_user_id,
      bot_access_token: data.bot.bot_access_token
    }
    return team.save()
  }).then(() => {
    req.flash('success', 'Successfully installed the slack app!');
    res.redirect('/')
  }).catch((err) => {
    console.error(err);
    req.flash('danger', 'Failed to install app.');
    res.redirect('/')
  })
})

module.exports = router;
