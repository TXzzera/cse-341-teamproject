const express = require('express');
const router = express.Router();

const shirtsController = require('../controllers/shirts');
const validateShirt = require('../middlewares/shirts');

router.get('/', shirtsController.getAll);
router.get('/:id', shirtsController.getSingle);
router.post('/', validateShirt.saveShirt, shirtsController.shirtCreate);
router.put('/:id', validateShirt.saveShirt, shirtsController.shirtUpdate);
router.delete('/:id', validateShirt.shirtsController.shirtDelete);

module.exports = router;