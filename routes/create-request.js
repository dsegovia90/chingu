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
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
