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
	profile: {
		timezone: Number, // UTC -5 entered as -5
		fccScore: Number  // Based on FCC levels completed?
	},
	pending: {
		created: Date
	},
	partners: [],
	admin: Boolean
});

module.exports = mongoose.model('User', User);
