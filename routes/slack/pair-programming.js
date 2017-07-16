var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Here I am - You called me?');
});

module.exports = router;
