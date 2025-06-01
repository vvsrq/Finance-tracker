const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/',  usersController.createUser); 
// router.get('/profile', authMiddleware, usersController.getProfile);
router.get('/logout',  usersController.logoutUser);

router.get('/error', (req, res) => {
  res.status(500).send('Simulated error');
});

module.exports = router;