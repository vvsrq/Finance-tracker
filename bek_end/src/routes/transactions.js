const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Получение всех транзакций
router.get('/', authMiddleware, transactionsController.getAllTransactions);

// Создание новой транзакции
router.post('/', authMiddleware, transactionsController.createTransaction);

// // Получение транзакции по ID
router.get('/:id', authMiddleware, transactionsController.getTransactionById);

// // Обновление транзакции по ID
router.put('/:id', authMiddleware, transactionsController.updateTransactionById);

// // Удаление транзакции по ID
router.delete('/:id', authMiddleware, transactionsController.deleteTransactionById);

module.exports = router;