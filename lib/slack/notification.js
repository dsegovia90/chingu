/*
Might we possibly have an issue with team info being duplicated?
It's something that we should at least check out:
  - What happens when an app is reinstalled?
  - What happens when two people from one team install the same app?
*/

var slack = require('slack');
var Team = require('../../models/teams');

function messageUsers(id1, id2, team) {
  Team.findOne({ teamId: team }, 'bot')
  .then(
    function(data) {
      // data will be null if app not installed
      if (data && data.bot.bot_user_id) {
        var users = id1 + ',' + id2 + ',' + data.bot.bot_user_id;
        var token = data.bot.bot_access_token;

        return slack.mpim.open({ users, token }, (err, data) => {
          if (err) { console.error(err); }
          else {
            let channel = data.group.id;
            let text = "Generic welcome message - You've been matched! Hip-hip-hooray! Some helpful information would be nice.";

            slack.chat.postMessage({token, channel, text}, (err, data) => {
              if (err) { console.error(err); }
            })
          }
        })
      }
    }
  )
  .catch(error => console.error(error));
};

module.exports = messageUsers;
