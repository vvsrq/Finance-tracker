const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Mapa19790@localhost:5432/finance", {
  dialect: 'postgres',
  protocol: 'postgres',
});

module.exports = sequelize;
