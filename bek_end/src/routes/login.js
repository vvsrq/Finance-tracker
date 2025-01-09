const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersControllerLogin.js');

router.post('/', usersController.loginUser);

module.exports = router;