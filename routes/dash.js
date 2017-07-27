const express = require('express');

const router = express.Router();
const User = require('../models/users');
const Match = require('../models/matches');
const Team = require('../models/teams');

router.get('/', function (req, res) {
  const data = {
    title: 'Chingu PP',
  };

  // if new match in database, prepare success message
  if (req.user.newMatch) {
    req.flash('success', 'Success! You have a new pair programming partner!');
    User.findByIdAndUpdate(req.user._id, { $unset: { newMatch: '' } })
    .catch(function (err) {
      console.error(err);
    });
  }

  // prepare information on current matches
  Promise.all([
  Match.find(
    { users: req.user }, // find matches where user is in users field
    { users: { $elemMatch: { $ne: req.user._id } } } //restrict fields to exclude same
  ).populate('users', 'slack.displayName slack.image'),
  Team.findOne({ teamId: req.user.slack.team.id }, {teamName: 1}),
  ])
  .then(function ([matches, team]) {
    data.team = team
    data.installLink = process.env.INSTALL_LINK
    if (matches.length) {
      data.matches = matches.map(match => match.users[0]);
    }
    res.render('dash', data); // placing here to avoid async issues
  })
  .catch(function (err) {
    console.error(err);
  });
});

module.exports = router;
