var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.post('/', function(req, res) {
  // TODO: check for a match!!!
  User.findOneAndUpdate({_id: res.locals.user}, { $set: {
    pending: {
      created: Date.now()
    }
  } }, function(err, doc) {
    var data = {
      title: 'Chingu PP',
      slack_id: process.env.SLACK_CLIENT_ID,
    };

    if (err) {
      console.log(err);
      data.message = "Oops! There was an error processing your application.";
    }
    else if (doc.pending.created) {
      data.message = "Success - your request has been updated!";
    }
    else {
      data.message = "Thank you for applying for a pair programming parter!";
    }
    res.render('index', data);
  });
});

module.exports = router;
