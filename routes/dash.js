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
    .catch(function(err){
      console.error(err);
    });
  }

  // prepare information on current matches
  Match.find(
    {users: req.user}, //I'm not quite sure why this line is working
    {"users": {$elemMatch: { $ne: req.user._id }}} //restrict fields to exclude same 
  )
  .populate('users', 'slack.displayName slack.image')
  .then(function(matches){
    if(matches.length){
      data.matches = matches.map(function(match) {
        return match.users[0];
      });
    }
    res.render('dash', data); // placing here to avoid async issues
  })
  .catch(function(err){
    console.error(err);
  })
});

module.exports = router;
