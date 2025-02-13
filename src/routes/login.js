const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersControllerLogin.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/', usersController.loginUser);

router.get('/enable2fa', authMiddleware, usersController.enable2FA);

module.exports = router;