var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');


/*  Checks if the user is authenticated, 
    it can be used to redirect to /login unauthenticated 
    access to certain routes. */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

/*  Send the req.user to the view as user variable.
    Even if the user is undefined (this can be used to
    show or hide data depending if there is a user 
    present or not). */
router.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('dash', {
    title: 'Chingu PP'
  });
});

/* Landing Page! (where users log in via slack) */
router.get('/login', function (req, res) {
  res.render('index', {
    title: 'Chingu PP'
  });
});

/* Logs user out */
router.get('/logout', isLoggedIn, function (req, res) {
  req.logout();
  res.redirect('/');
});

/* Handle ajax request to change timezone */
router.put('/update-timezone', isLoggedIn, require('./update-timezone'));

/* Handle slack OAuth process */
router.use('/auth', require('./auth'));

/* Handle form submission - create/update request for partner */
router.use('/create-request', isLoggedIn, require('./create-request'));

/* Handle form submission - cancel request for partner */
router.use('/cancel-request', isLoggedIn, require('./cancel-request'));

module.exports = router;
