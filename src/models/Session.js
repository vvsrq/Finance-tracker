// src/models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config.js'); 
const User = require('./User.js');

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
         references: {
            model: 'Users', 
            key: 'id',
        },
    },
}, {
    tableName: 'Sessions',
});

Session.belongsTo(User, { foreignKey: 'userId' });
module.exports = Session;