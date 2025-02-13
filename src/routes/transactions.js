const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/', authMiddleware, transactionsController.getAllTransactions);

router.post('/', authMiddleware, transactionsController.createTransaction);

router.get('/:id', authMiddleware, transactionsController.getTransactionById);

router.put('/:id', authMiddleware, transactionsController.updateTransactionById);

router.delete('/:id', authMiddleware, transactionsController.deleteTransactionById);

module.exports = router;