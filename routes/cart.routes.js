const router = require('express').Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.view);
router.post('/add/:id', cartController.add);
router.post('/remove/:id', cartController.remove);
router.post('/clear', cartController.clear);

module.exports = router;
