const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const validateUser = require('../middlewares/users');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', validateUser.saveUser, usersController.userCreate);
router.put('/:id', validateUser.saveUser, usersController.userUpdate);
router.delete('/:id', usersController.userDelete);

module.exports = router;