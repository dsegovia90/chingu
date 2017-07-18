var express = require('express');
var router = express.Router();

router.use('/pair-programming', require('./pair-programming'));
router.use('/actions', require('./actions'));

module.exports = router;
