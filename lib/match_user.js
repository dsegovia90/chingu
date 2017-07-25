const User = require('../models/users');
const Match = require('../models/matches');
const messageUsers = require('../lib/slack/notification');

/* -----------------------MAIN FUNCTION---------------------------
  given a user, searches database for match
  if match is found, calls makeMatch to update user docs
----------------------------------------------------------------*/
function findMatch(user) {
  const acceptableTimezones = timezonesNear(user.profile.timezone);
  const match = {
    'slack.id': { $ne: user.slack.id }, // don't pair with self!
    'slack.team.id': user.slack.team.id, // pair within team
    'pending.created': { $ne: null }, // is looking for a match
    'profile.fccScore': { $lte: user.profile.fccScore + 1, $gte: user.profile.fccScore - 1 }, // match levels (approx.)
    'profile.timezone': { $in: acceptableTimezones }, // in similar timezones
  };
  const order = {
    'pending.created': 1,
  };

  User.findOne(match, 'slack.id', order, function (err, doc) {
    if (err) {
      console.error(err);
    } else {
      if (doc) {
        makeMatch(user._id, doc._id)
        .then(function matched() {
          messageUsers(user.slack.id, doc.slack.id, user.slack.team.id);
        })
        .catch(error => console.error(error));
      }
    }
  });
}

// /////////////////////////////////////////////////////////////
// ////////////////////Helper Functions/////////////////////////
// /////////////////////////////////////////////////////////////

/*
  adds new match to "partners" and deletes pending requests
*/
function makeMatch(id1, id2) {
  var match = new Match({ users: [id1, id2] });
  return match.save()
  .then(
    function fulfilled() {
      return clearPendingRequests(id1, id2);
    }
  )
  .then(
    function fulfilled() {
      console.log("match made - success");
      return true;
    },
    function rejected(reason) {
      console.error("attempted match unsuccessful");
      console.error(reason);
    }
  );

  function clearPendingRequests(id1, id2) {
    // var update = { $unset: {pending: ""}, $set: {newMatch: true, matchedTo: id1} };

    return Promise.all([
      User.findByIdAndUpdate(id1, { $unset: { pending: '' }, $set: { newMatch: true } }),
      User.findByIdAndUpdate(id2, { $unset: { pending: '' }, $set: { newMatch: true } }),
    ]);
  }
}

/*
  function to find "close" timezones
  returns array of timezones that differ from input by <= 1.5 hours
*/
function timezonesNear(tz) {
  var tzs = require('./timezones.js');

  // maps 12 -> -12, 13 -> -11, etc.
  var center = ((tz + 12) % 24) - 12;

  // catch appropriate slice of tzs
  var start = Math.max(tzs.indexOf(Math.floor(center - 1)), 0);
  var stop = tzs.indexOf(Math.ceil(center + 1)) + 1;
  var zones = tzs.slice(start, stop);

  // if center is -12, add in time zone +11 manually
  if (center === -12) {
    zones.push(11);
  }

 // add in zones >= 12		 +  // if center is -12, add in time zone +11 manually
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
