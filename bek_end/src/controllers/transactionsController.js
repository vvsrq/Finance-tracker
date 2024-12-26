const Transaction = require('../models/Transaction');
let transactions = [];


exports.getAllTransactions = (req, res) => {

  res.json(transactions);

};


exports.createTransaction = (req, res) => {
  const { amount, date, category, description } = req.body;
  const newTransaction = new Transaction(amount, date, category, description);
  transactions.push(newTransaction);
  res.status(201).json(newTransaction);

};

exports.getTransactionById = (req, res) => {
  const transactionId = parseInt(req.params.id); 
  const transaction = transactions.find(t => t.id === transactionId);

  if (!transaction) {
    return res.status(404).json({ message: 'Транзакция не найдена' });
  }

  res.json(transaction);
};

exports.updateTransaction = (req, res) => {
  const transactionId = parseInt(req.params.id);
  const transactionIndex = transactions.findIndex(t => t.id === transactionId);

  if (transactionIndex === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  transactions[transactionIndex] = { ...transactions[transactionIndex], ...req.body }; 

  res.json(transactions[transactionIndex]);
};

exports.deleteTransaction = (req, res) => {
  const transactionId = parseInt(req.params.id);
  const transactionIndex = transactions.findIndex(t => t.id === transactionId);

  if (transactionIndex === -1) {
    return res.status(404).json({ message: 'Транзакция не найдена' });
  }

  transactions.splice(transactionIndex, 1); // Удаляем транзакцию из массива

  res.json({ message: 'Транзакция удалена' });
};
