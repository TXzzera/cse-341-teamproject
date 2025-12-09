const express = require('express');
const router = express.Router();

const shirtsController = require('../controllers/shirts');
const {isAuthenticated} = require('../middlewares/auth');

router.get('/', 
//#swagger.tags = ['Shirts'],
shirtsController.getAll);

router.get('/:id',
//#swagger.tags = ['Shirts'],
shirtsController.getSingle);

// #swagger.security = [{ SessionAuth: [] }]
router.post('/',
//#swagger.tags = ['Shirts'],
isAuthenticated, shirtsController.shirtCreate);

// #swagger.security = [{ SessionAuth: [] }]
router.put('/:id',
//#swagger.tags = ['Shirts'],
isAuthenticated, shirtsController.shirtUpdate);

// #swagger.security = [{ SessionAuth: [] }]
router.delete('/:id',
//#swagger.tags = ['Shirts'],
isAuthenticated, shirtsController.shirtDelete);

module.exports = router;