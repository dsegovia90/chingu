var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	slack: {
		id: String,
		displayName: String,
    email: String,
    image: String,
    team: Object
	},
	pending: {
		created: Date,
		timezone: Number, // UTC -5 entered as -5
		level: Number, // Based on FCC levels completed?
	},
	partners: [],
	admin: Boolean
});

module.exports = mongoose.model('User', User);
