var express = require('express');
var router = express.Router();
var User = require('../models/users');
var runMatch = require('../lib/match_user.js');

router.get('/', function (req, res) {
  res.render('request-match');
});

router.post('/', function (req, res) {
  var update = {
    $set: {
      pending: {
        created: new Date(),
        timezone: req.body.timezone,
        fccScore: req.body.fccScore
      }
    }
  };

  User.findByIdAndUpdate(req.user._id, update, {new: true}).exec()
  .then(runMatch);

  res.redirect('/');
});

router.get('/delete', function (req, res) {
  User.findByIdAndUpdate(req.user._id, { $unset: { pending: "" } }).exec();
  res.redirect('/');
});

module.exports = router;
