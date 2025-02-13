const Category = require('../models/Category');


// Получить все категории
async function getAllCategories(req, res) {
    try {
        const userId = req.user.userId;
        const categories = await Category.findAll({ where: { userId } });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

// Создать новую категорию
async function createCategory(req, res) {
    try {
        const { name, type } = req.body;
        const userId = req.user.userId;
        console.log(userId);

        if (!name || !type) {
            return res.status(400).json({ message: 'Не все поля заполнены' });
        }
        const newCategory = await Category.create({ name, type, userId });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

// Получить категорию по ID
async function getCategoryById(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Ошибка при получении категории:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

// Обновить категорию по ID
async function updateCategory(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const { name, type } = req.body;
        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }
        await Category.update({ name, type }, { where: { id, userId } });
        const updatedCategory = await Category.findOne({ where: { id, userId } });
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Ошибка при обновлении категории:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

// Удалить категорию по ID
async function deleteCategory(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }
        await Category.destroy({ where: { id, userId } });
        res.status(200).json({ message: 'Категория удалена' });
    } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};