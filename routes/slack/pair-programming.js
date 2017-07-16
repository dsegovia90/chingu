const express = require('express');

const router = express.Router();

const User = require('../../models/users');

router.get('/', function (req, res) {
  res.send('Here I am - You called me?');
});

router.post('/', function (req, res) {
  // check verification token
  if (req.body.token !== process.env.VERIFICATION_TOKEN) {
    return;
  }

  // find user in database
  User.findOne({ 'slack.id': req.body.user_id })
  .then(
    function resolved (user) {
      if (user) {
        res.json({
          text: 'Hi, there - I know you!',
        });
      } else {
        res.json({
          text: 'A newbie!',
        });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.json({text: 'error'});
    });
});

module.exports = router;
