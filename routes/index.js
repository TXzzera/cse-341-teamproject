const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/shirts', require('./shirts'));
router.use('/stores', require('./stores'));
router.use('/reviews', require('./reviews'));

router.get('/login',
//#swagger.tags = ['Authentication'],
passport.authenticate('github'), (req, res) => {});

router.get('/logout',
//#swagger.tags = ['Authentication'],
function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.use('/', require('./swagger'));

module.exports = router;