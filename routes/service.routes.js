const router = require('express').Router();
const serviceController = require('../controllers/service.controller');

router.get('/', serviceController.list);
router.get('/:id', serviceController.detail);

module.exports = router;
