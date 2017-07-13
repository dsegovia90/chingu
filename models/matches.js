const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Match = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Match', Match);
