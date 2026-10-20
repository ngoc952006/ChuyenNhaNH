const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.get('/login', authController.loginForm);
router.post('/login', authController.login);

router.get('/register', authController.registerForm);
router.post('/register', authController.register);

router.post('/logout', authController.logout);

module.exports = router;
