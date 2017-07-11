var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Match = new Schema({
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
  created: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Match', Match);
