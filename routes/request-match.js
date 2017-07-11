var express = require('express');
var router = express.Router();
var User = require('../models/users');
var runMatch = require('../lib/match_user.js');
var fcc = require('../lib/fccScore.js');

router.get('/', function (req, res) {
  var fccLevels = fcc.toLevelsArray();
  res.render('request-match', {fccLevels: fccLevels});
});

router.post('/', function (req, res) {
  var update = {
    $set: {
      profile: {
        timezone: req.body.timezone,
        fccScore: req.body.fccScore,
        fccLevel: fcc.getLevel(req.body.fccScore)
      },
      pending: {
        created: new Date()
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
