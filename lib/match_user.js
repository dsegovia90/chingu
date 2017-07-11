var User = require('../models/users');

/*
  given a user, searches database for match
  if match is found, calls makeMatch to update user docs
*/
function findMatch(user) {
  var acceptable_timezones = timezonesNear(user.profile.timezone);
  var match = {
    "slack.id": { $ne: user.slack.id }, // don't pair with self!
    "slack.team.id": user.slack.team.id, // pair within team
    //TODO: add level to pair request form
    //TODO: don't choose the same match twice
    //"level": user.profile.fccScore,
    "profile.timezone": { $in : acceptable_timezones }, // match timezone
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
        makeMatch(user._id, doc._id);
      }
    }
  });
}

/*
  adds new match to "partners" and deletes pending requests
*/
function makeMatch(id1, id2) {
  var when = Date.now();
  return Promise.all([
    addPartner(id1, id2, when),
    addPartner(id2, id1, when)
  ])
  .then(
    function fulfilled() {
      return clearPendingRequests(id1, id2);
    }
  )
  .then(
    function fulfilled() {
      console.log("match made - success");
    },
    function rejected(reason) {
      console.log("attempted match unsuccessful");
      console.log(reason);
    }
  );

  function clearPendingRequests(id1, id2) {
    var update = { $unset: {pending: ""} };

    return Promise.all([
      User.findByIdAndUpdate(id1, update),
      User.findByIdAndUpdate(id2, update)
    ]);
  }

  function addPartner(userID, matchID, when) {
    var update = {
      $push: { "partners": {"who": matchID, "when": when} }
    };
    return User.findByIdAndUpdate(userID, update);
  }
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
