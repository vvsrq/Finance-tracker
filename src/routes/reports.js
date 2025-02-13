const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/category', reportsController.getCategoryReport);
router.get('/monthly', reportsController.getMonthlyReport);

module.exports = router;