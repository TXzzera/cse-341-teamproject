const express = require('express');
const router = express.Router();

const reviewsController = require('../controllers/reviews');
const {isAuthenticated} = require('../middlewares/auth');

router.get('/', 
//#swagger.tags = ['Reviews'],
reviewsController.getAll);

router.get('/:id',
//#swagger.tags = ['Reviews'],
reviewsController.getSingle);

// #swagger.security = [{ SessionAuth: [] }]
router.post('/',
//#swagger.tags = ['Reviews'],
isAuthenticated, reviewsController.reviewCreate);

// #swagger.security = [{ SessionAuth: [] }]
router.put('/:id',
//#swagger.tags = ['Reviews'],
isAuthenticated, reviewsController.reviewUpdate);

// #swagger.security = [{ SessionAuth: [] }]
router.delete('/:id',
//#swagger.tags = ['Reviews'],
isAuthenticated, reviewsController.reviewDelete);

module.exports = router;