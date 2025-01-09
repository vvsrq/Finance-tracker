const Transaction = require('../models/Transaction');

// Получение всех транзакций
async function getAllTransactions(req, res) {
    try {
     console.log("getAllTransactions: запрос получен") 

        const userId = req.session.userId;
        console.log("userId", userId); 

        const transactions = await Transaction.findAll({ where: { userId } });
        console.log("Транзакции полученны:", transactions) 
         res.status(200).json(transactions);
  }
  catch (error) {
     console.error("Ошибка при getAllTransactions:", error) 
     res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Создание новой транзакции
async function createTransaction(req, res) {
    try {
        const { amount, date, categoryId,  description } = req.body;
        const userId = req.session.userId;
        console.log(req.body)
        if (!amount || !categoryId || !date) {
            return res.status(400).json({ message: 'Необходимые поля отсутствуют' });
        }
    const newTransaction = await Transaction.create({
        amount,
        categoryId,
        date,
        description,
        userId,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Ошибка при создании транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Получение транзакции по ID
async function getTransactionById(req, res) {
  try {
      const userId = req.session.userId;
        const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
          userId
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Ошибка при получении транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Обновление транзакции по ID
async function updateTransactionById(req, res) {
  try {
       const userId = req.session.userId;
         const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
          userId
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }
    const { amount, categoryId, date, description } = req.body;


       await transaction.update({
            amount,
            categoryId,
            date,
            description
        });

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Ошибка при обновлении транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Удаление транзакции по ID
async function deleteTransactionById(req, res) {
  try {
       const userId = req.session.userId;
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
          userId
      },
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }
        await transaction.destroy();

    res.status(204).json(); // No content
  } catch (error) {
    console.error('Ошибка при удалении транзакции:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById
};
