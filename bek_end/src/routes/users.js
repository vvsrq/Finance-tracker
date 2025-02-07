const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',  usersController.createUser); 
// router.get('/profile', authMiddleware, usersController.getProfile);
router.get('/logout',  usersController.logoutUser);

module.exports = router;