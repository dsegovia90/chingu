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
		created: { type: Date, default: Date.now },
		timezone: Number, // UTC -5 entered as -5
		level: Number, // Based on FCC levels completed?
		interests: [String] // To pair by interest (e.g. data science, p1xt guides)
	}
});

module.exports = mongoose.model('User', User);
