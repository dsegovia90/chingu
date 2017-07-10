var express = require('express');
var router = express.Router();

function isLoggedInAndAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  } else {
    res.redirect('/login');
  }
}

/* GET users listing. */
router.get('/', isLoggedInAndAdmin, function (req, res, next) {
  res.render('admin')
});

module.exports = router;
