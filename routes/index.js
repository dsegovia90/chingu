var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chingu PP', slack_id: process.env.SLACK_CLIENT_ID });
});

module.exports = router;
