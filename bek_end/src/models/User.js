const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: {
      notEmpty: true,
      len: [3, 50], 
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
      len: [6, 100], 
    }
  },
  secret2FAKey: {
    type: DataTypes.STRING,
    allowNull: true, 
    }
});

module.exports = User;