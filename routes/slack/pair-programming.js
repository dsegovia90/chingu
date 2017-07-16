const express = require('express');

const router = express.Router();

const User = require('../../models/users');

const responses = require('../../lib/slack-responses');

router.get('/', function (req, res) {
  res.send('Here I am - You called me?');
});

router.post('/', function (req, res) {
  // check verification token
  if (req.body.token !== process.env.VERIFICATION_TOKEN) {
    return;
  }

  // find user in database
  User.findOne({ 'slack.id': req.body.user_id, 'slack.team.id': req.body.team_id })
  .then(
    function resolved(user) {
      if (user) {
        return [null, user];
      }
      const newUser = new User();
      newUser.slack.id = req.body.user_id;
      newUser.slack.user_name = req.body.user_name;
      newUser.slack.team.id = req.body.team_id;
      newUser.slack.team.domain = req.body.team_domain;
      newUser.admin = false;

      return Promise.all([true, newUser.save()]);
    })
    .then(
      function sendResponse([isNew, user]) {
        if (isNew) {
          res.json(responses.newUser(user.slack.user_name));
        } else {
          res.json({
            text: 'Welcome back, ' + user.slack.user_name + '!'
          });
        }
      }
    )
    .catch(function (error) {
      console.error(error);
      res.json({ text: 'error' });
    });
});

module.exports = router;
