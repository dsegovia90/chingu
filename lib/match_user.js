var User = require('../models/users');

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

function findMatch(user) {
  var acceptable_timezones = timezonesNear(user.pending.timezone);
  var match = {
    "slack.id": { $ne: user.slack.id },
    "slack.team.id": user.slack.team.id,
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

function timezonesNear(tz) {
  var tzs = [-12,-11,-10,-9.5,-9,-8,-7,-6,-5,-4,-3.5,-3,-2.5,-2,-1,0,1,2,3,3.5,4,4.5,5,5.5,6,6.5,7,8,9,9.5,10,10.5,11,12,13,14];

  var center = ((tz + 12) % 24) - 12;
  var start = tzs.indexOf(Math.floor(center - 1));
  var stop = tzs.indexOf(Math.ceil(center + 1)) + 1;
  var zones = tzs.slice(start, stop);

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
