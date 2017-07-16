var express = require('express');
var router = express.Router();

router.use('/pair-programming', require('./pair-programming'));

module.exports = router;
