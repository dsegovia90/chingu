const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Team = new Schema({
  accessToken: String,
  scope: String,
  userId: String,
  teamName: String,
  teamId: String,
  bot: {
    bot_user_id: String,
    bot_access_token: String
  },
  installedOn: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Team', Team);
