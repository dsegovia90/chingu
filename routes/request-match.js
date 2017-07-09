var express = require('express');
var router = express.Router();
var User = require('../models/users')

router.get('/', function (req, res) {
  res.render('request-match');
});

router.post('/', function (req, res) {
  var timezone = req.body.timezone;
  var fccScore = req.body.fccScore;

  User.findOne({ _id: req.user._id }, function (err, user) {
    console.log(user.pending.created)
    if (user.pending.created) {
      user.pending.created = new Date();
      user.pending.timezone = timezone;
      user.pending.level = fccScore;
      user.save()
    } else {
      user.pending.created = new Date();
      user.pending.timezone = timezone;
      user.pending.level = fccScore;
      user.save()
    }
  })
  res.redirect('/')
})

router.get('/delete', function (req, res) {
  User.findOne({_id: req.user._id}, function(err, user){
    user.pending = undefined
    user.save()
    res.redirect('/')
  })
});

module.exports = router;
