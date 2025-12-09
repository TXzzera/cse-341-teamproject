const express = require('express');
const router = express.Router();

const storesController = require('../controllers/stores');
const {isAuthenticated} = require('../middlewares/auth');

router.get('/', 
//#swagger.tags = ['Stores'],
storesController.getAll);

router.get('/:id',
//#swagger.tags = ['Stores'],
storesController.getSingle);

// #swagger.security = [{ SessionAuth: [] }]
router.post('/',
//#swagger.tags = ['Stores'],
isAuthenticated, storesController.storeCreate);

// #swagger.security = [{ SessionAuth: [] }]
router.put('/:id',
//#swagger.tags = ['Stores'],
isAuthenticated, storesController.storeUpdate);

// #swagger.security = [{ SessionAuth: [] }]
router.delete('/:id',
//#swagger.tags = ['Stores'],
isAuthenticated, storesController.storeDelete);

module.exports = router;