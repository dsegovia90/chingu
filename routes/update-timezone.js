
var User = require('../models/users');

module.exports = function(req, res){
  console.log(req.body.newTimeZone); //this attribute is sent by the ajax request
  User.findOne({_id: req.user._id}, function(err, user){
    user.pending.timezone = req.body.newTimeZone;
    user.save();
  });
  //I would love to send a message back to the app upon successfull change of the timezone @dsegovia90
  res.json({received: true});
}
