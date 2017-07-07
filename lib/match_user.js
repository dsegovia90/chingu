/*
  NB: THIS IS CURRENTLY REALLY BAD FROM AN ERROR HANDLING PERSPECTIVE.
  TODO: REWRITE CODE TO
    - HANDLE ERRORS FOR REAL (ESP IF ONLY UPDATE ONLY WORKS FOR ONE USER)
    - ELIMINATE DUPLICATE CALLS TO MAKEMATCH FUNCTION
*/

var User = require('../models/users');

/*
  given a user, searches database for match
  if match is found, calls makeMatch to update user docs
*/
function findMatch(user) {
  var acceptable_timezones = timezonesNear(user.pending.timezone);
  var match = {
    "slack.id": { $ne: user.slack.id },
    "slack.team.id": user.slack.team.id,
    //TODO: add level to pair request form
    //"pending.level": user.pending.level,
    "pending.timezone": { $in : acceptable_timezones }
  };
  var order = {
    "pending.created": 1
  };

  User.findOne(match, order, function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      if (doc) {
        var when = Date.now();
        makeMatch(doc._id, user._id, when);
        makeMatch(user._id, doc._id, when);
      }
    }
  });
}

/*
  adds user with _id = id2 to id1's matches & removes pending request
  right now needs to be called twice (once for each user in match)
*/
function makeMatch(id1, id2, when) {
  var update = {
    $unset: {pending: ""},
    $push: {
      "partners": {"who": id2, "when": when}
    }
  };
  User.findByIdAndUpdate(id1, update, function(err) {
    if (err) {
      console.log(err);
    }
  });
}

/*
  function to find "close" timezones
  returns array of timezones that differ from input by <= 1.5 hours
*/
function timezonesNear(tz) {
  // tzs MUST MATCH timezone options on input form!!!
  var tzs = [-12,-11,-10,-9.5,-9,-8,-7,-6,-5,-4,-3.5,-3,-2.5,-2,-1,0,1,2,3,3.5,4,4.5,5,5.5,6,6.5,7,8,9,9.5,10,10.5,11,12,13,14];

  // maps 12 -> -12, 13 -> -11, etc.
  var center = ((tz + 12) % 24) - 12;

  // catch appropriate slice of tzs
  var start = tzs.indexOf(Math.floor(center - 1));
  var stop = tzs.indexOf(Math.ceil(center + 1)) + 1;
  var zones = tzs.slice(start, stop);

  // add in zones >= 12
  if (zones.indexOf(-12) > -1) {
    zones.push(12);
  }
  if (zones.indexOf(-11) > -1) {
    zones.push(13);
  }
  if (zones.indexOf(-10) > -1) {
    zones.push(14);
  }

  return zones;
}

module.exports = findMatch;
