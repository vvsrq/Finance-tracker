const { DataTypes } = require('sequelize');
const sequelize = require('../config.js'); 
const Category = require('./Category.js');
const User = require('./User.js');

const Transaction = sequelize.define('transactions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    categoryid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories', 
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
  tableName: 'transactions'  
});

Transaction.belongsTo(Category, { foreignKey: 'categoryId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = Transaction;