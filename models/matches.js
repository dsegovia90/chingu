var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Match = new Schema({
  users: [Schema.Types.ObjectId],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', Match);
