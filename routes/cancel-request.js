var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.post('/', function(req, res) {
  User.findOneAndUpdate({_id: res.locals.user}, { $unset: {pending: ""} }, function(err, doc) {
    var data = {
      title: 'Chingu PP',
      slack_id: process.env.SLACK_CLIENT_ID,
    };

    if (err) {
      console.log(err);
      data.message = "Oops! There was an error canceling your request.";
    }
    else if (doc.pending.created){
      data.message = "Your request for a pair programming partner has been cancelled.";
    }
    res.render('index', data);
  });
});

module.exports = router;
