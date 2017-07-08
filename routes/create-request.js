var express = require('express');
var router = express.Router();
var User = require('../models/users');
var findMatch = require('../lib/match_user');

router.post('/', function(req, res) {
  findMatch(req.user);
  User.findOneAndUpdate({_id: res.locals.user}, { $set: {
    pending: {
      created: Date.now()
    }
  } }, function(err, doc) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
