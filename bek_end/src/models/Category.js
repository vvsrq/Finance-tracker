// src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config.js'); 
const User = require('./User'); 

const Category = sequelize.define('categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
}, {
  tableName: 'categories' 
});

Category.belongsTo(User, { foreignKey: 'userId' });
module.exports = Category;