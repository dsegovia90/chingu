var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var Match = require('../models/matches.js');

function isLoggedInAndAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  } else {
    res.redirect('/login');
  }
}

var sortByTimezone = (a, b) => {
  return a.profile.timezone - b.profile.timezone
}

/* GET users listing. */
router.get('/', isLoggedInAndAdmin, function (req, res, next) {
  let data = {}

  User.find({ 'slack.team.id': req.user.slack.team.id }, {
    'slack.displayName': 1,
    'slack.team.name': 1,
    'profile': 1,
    'partners': 1,
    'matchedTo': 1
  }).populate('matchedTo', 'slack.displayName')
  .then(function (userList) {
    data.userList = userList.sort(sortByTimezone);
    const _idList = userList.map(function (user) {
      return user._id
    })
    /* Find all matches that belong to the array of _idList */
    return Match.find({users: { $in: _idList }})
                .populate('users', 'slack.displayName')
  })
  .then(function (matches) {
    data.matches = matches;

    res.render('admin', data)
  })
  .catch(function(err){
    console.error(err)
  })
});

module.exports = router;
