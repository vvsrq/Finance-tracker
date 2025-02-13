const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Sequelize = require('sequelize');

async function getCategoryReport(req, res) {
    try {
        const userId = req.user.userId;

        const categories = await Category.findAll({
            where: { userId },
            attributes: ['id', 'name', 'type'],
        });

        const transactions = await Transaction.findAll({
             where: { userId },
              attributes: ['id', 'amount', 'categoryId', 'date']
        });

        const report = categories.map(category => {
         const categoryTransactions = transactions.filter(transaction => transaction.categoryId === category.id);
            const totalAmount = categoryTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

         return {
           categoryId: category.id,
              categoryName: category.name,
              categoryType: category.type,
            totalAmount: totalAmount
           }
        });

        res.status(200).json(report);
    } catch (error) {
         console.error('Ошибка при получении отчета по категориям:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}


async function getMonthlyReport(req, res) {
      try {
        const userId = req.user.userId;

            const currentDate = new Date();
             const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const transactions = await Transaction.findAll({
                  where: {
                     userId,
                    date: {
                            [Sequelize.Op.between]: [firstDay, lastDay]
                      }
                  }
             })
         res.status(200).json(transactions);
       } catch (error) {
           console.error('Ошибка при получении месячного отчета:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
       }
   }


module.exports = {
    getMonthlyReport,
    getCategoryReport
};