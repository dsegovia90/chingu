var express = require('express');
var router = express.Router();
var User = require('../models/users.js');

function isLoggedInAndAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  } else {
    res.redirect('/login');
  }
}

/* GET users listing. */
router.get('/', isLoggedInAndAdmin, function (req, res, next) {
  User.find({}, {
    'slack.displayName': 1,
    'slack.team.name': 1,
    'profile': 1,
    'partners': 1
  })
  .then(function(userList){
    res.render('admin', {userList: userList});
  }).catch(function(err){
    console.error(err);
  });
});

module.exports = router;
