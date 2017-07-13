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

/* GET users listing. */
router.get('/', isLoggedInAndAdmin, function (req, res, next) {
  let data = {}
  User.find({ 'slack.team.id': req.user.slack.team.id }, {
    'slack.displayName': 1,
    'slack.team.name': 1,
    'profile': 1,
    'partners': 1
  })
  .then(function (userList) {
    data.userList = userList;
    const _idList = userList.map(function (user) {
      return user._id
    })
    return Match.find({users: { $in: _idList }})
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
