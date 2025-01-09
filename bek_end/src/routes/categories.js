const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const authMiddleware = require('../middleware/authMiddleware'); // Защищаем маршруты

router.get('/', authMiddleware, categoriesController.getAllCategories);

router.post('/', authMiddleware, categoriesController.createCategory);

router.get('/:id', authMiddleware, categoriesController.getCategoryById);

router.put('/:id', authMiddleware, categoriesController.updateCategory);

router.delete('/:id', authMiddleware, categoriesController.deleteCategory);


module.exports = router;