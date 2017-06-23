var SlackStrategy = require('passport-slack').Strategy
var User = require('../models/users')

module.exports = function(passport){
  passport.serializeUser(function(user, done){
		done(null, user.id)
	})
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user)
		})
	})

  passport.use(new SlackStrategy({
		clientID: process.env.SLACK_CLIENT_ID,
		clientSecret: process.env.SLACK_CLIENT_SECRET
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function(){
			User.findOne({ 'slack.id': profile.id }, function(err, user){
				if(err){
					return done(err)
				}

        console.log('here')
				if(user){
					return done(null, user)
				}else{
					var newUser = new User()

					newUser.slack.id = profile.user.id
					newUser.slack.displayName = profile.user.name
					newUser.slack.email = profile.user.email
					newUser.slack.image = profile.user.image_1024
					newUser.slack.team = profile.user.team

					newUser.save(function(err){
						if(err) throw err
						return done(null, newUser)
					})
				}
			})
		})
	}))
}