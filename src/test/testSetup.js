// src/test/testSetup.js
require('dotenv').config();
const sequelize = require('../config.js'); // Подключение к базе данных
const User = require('../models/User');
const Session = require('../models/Session');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

before(async function() {
    this.timeout(100000); // Увеличиваем таймаут, если нужно

    if (process.env.NODE_ENV === 'test') {
        console.log('Используется тестовая база данных. Синхронизация...');
        try {
          await sequelize.sync({ force: true }); 
           console.log('База данных синхронизирована');
      } catch (error) {
        //  console.error('Ошибка при синхронизации базы данных:', error);
         process.exit(1); //  Выходим, если произошла ошибка
      }
    } else {
        console.warn('Тесты запущены не в тестовом окружении!');
    }
});

after(async function() {
  console.log('Завершение работы');
  await sequelize.close(); // Закрываем подключение после завершения всех тестов
});