const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
  slack: {
    id: String,
    displayName: String,
    email: String,
    image: String,
    team: {
      name: String,
      id: String,
      domain: String,
      image: String,
    },
  },
  profile: {
    timezone: Number, // UTC -5 entered as -5
    fccScore: Number, // Based on FCC levels completed?
    fccLevel: String,
  },
  pending: {
    created: Date,
  },
  newMatch: Boolean,
  matchedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  admin: Boolean,
});

module.exports = mongoose.model('User', User);
