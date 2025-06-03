const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..','.env') })
const { Sequelize } = require('sequelize');

const db = process.env.DB_URL;
if (!db) {
  throw new Error('DB_URL is not defined in the environment variables');
}

const sequelize = new Sequelize(db, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false, 
    }
  },
  logging: false,
});

module.exports = sequelize;
