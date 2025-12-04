const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/shirts', require('./shirts'));

module.exports = router;