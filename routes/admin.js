const express = require('express');

const router = express.Router();
const User = require('../models/users.js');
const Match = require('../models/matches.js');
const Team = require('../models/teams.js');

function isLoggedInAndAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET users listing. */
router.get('/', isLoggedInAndAdmin, function (req, res) {
  const data = {};

  Promise.all([
    User.find({ 'slack.team.id': req.user.slack.team.id }, {
      'slack.displayName': 1,
      'slack.user_name': 1,
      profile: 1,
      pending: 1,
    }),
    Team.findOne({ teamId: req.user.slack.team.id }, { teamName: 1 }),
  ])
  .then(function fulfilled([users, team]) {
    data.teamName = (team ? team.teamName : ' - you must install the slack app to see team info - ');
    data.userList = users;
    return getUserIds(users);
  })
  .then(function fulfilled(ids) {
    return Match.find({ users: { $in: ids } });
  })
  .then(function (matches) {
    data.matches = matches;
    res.render('admin', data);
  })
  .catch(function(err){
    console.error(err);
  });
});

function getUserIds(userList) {
  return userList.map(user => user._id);
}

module.exports = router;
