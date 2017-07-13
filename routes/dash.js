var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Match = require('../models/matches');

router.get('/', function (req, res) {
  var data = {
    title: 'Chingu PP'
  };

  // if new match in database, prepare success message
  if (req.user.newMatch) {
    data.message = "Success! You have a new pair programming partner!";
    User.findByIdAndUpdate(req.user._id, {$unset: {newMatch: ""}})
    .exec(function(err) {
      if (err) {
        console.error(err);
      }
    });
  }

  // prepare information on current matches
  Match.find({users: req.user}, {"users": {$elemMatch: { $ne: req.user._id }}})
  .populate('users', 'slack.displayName slack.image')
  .exec(function(err, matches) {
    if (err) {
      console.error(err);
    }
    else if (matches.length) {
      data.matches = matches.map(function(match) {
        return match.users[0];
      });
    }

    // send response
    res.render('dash', data);
  });
});

module.exports = router;
