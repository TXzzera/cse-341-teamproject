const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/shirts', require('./shirts'));

router.get('/', (req, res) => {
    //#swagger.tags = ['Hello World']
    res.send('Hello World!');
});

module.exports = router;