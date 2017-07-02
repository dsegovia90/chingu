var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

router.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Chingu PP',
    slack_id: process.env.SLACK_CLIENT_ID });
});

/* Handle slack OAuth process */
router.use('/auth', require('./auth'));

/* Handle form submission - create/update request for partner */
router.use('/create-request', isLoggedIn, require('./create-request'));

/* Handle form submission - cancel request for partner */
router.use('/cancel-request', isLoggedIn, require('./cancel-request'));

router.get('/logout', isLoggedIn, function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
