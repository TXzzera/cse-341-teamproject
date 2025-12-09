const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const {isAuthenticated} = require('../middlewares/auth');

router.get('/', 
//#swagger.tags = ['Users'],
usersController.getAll);

router.get('/:id', 
//#swagger.tags = ['Users'],
usersController.getSingle);

 // #swagger.security = [{ SessionAuth: [] }]
router.post('/', 
//#swagger.tags = ['Users'],
isAuthenticated, usersController.userCreate);

 // #swagger.security = [{ SessionAuth: [] }]
router.put('/:id',
//#swagger.tags = ['Users'],
isAuthenticated, usersController.userUpdate);

 // #swagger.security = [{ SessionAuth: [] }]
router.delete('/:id',
//#swagger.tags = ['Users'],
isAuthenticated, usersController.userDelete);

module.exports = router;