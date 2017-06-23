var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
	slack: {
		id: String,
		displayName: String,
    email: String,
    image: String,
    team: Object
	}
})

module.exports = mongoose.model('User', User)