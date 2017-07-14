const SlackStrategy = require('passport-slack').Strategy;
const User = require('../models/users');

module.exports = function passportFunc(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
  },
    (token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'slack.id': profile.id })
          .then((user) => {
            if (user) {
              return done(null, user);
            }
            const newUser = new User();
            newUser.slack.id = profile.user.id;
            newUser.slack.displayName = profile.user.name;
            newUser.slack.email = profile.user.email;
            newUser.slack.image = profile.user.image_1024;
            newUser.slack.team.name = profile.team.name;
            newUser.slack.team.id = profile.team.id;
            newUser.slack.team.domain = profile.team.domain;
            newUser.slack.team.image = profile.team.image_original;
            newUser.admin = false;
            newUser.save();

            return done(null, newUser);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }));
};
