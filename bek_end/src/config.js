const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // Ваш пользователь PostgreSQL
  host: 'your_host',          // Хост вашей базы данных (localhost, если локально)
  database: 'finance',  // Название вашей базы данных
  password: 'Mapa19790',  // Ваш пароль
  port: 5432,                // Порт PostgreSQL (по умолчанию 5432)
  // ssl: { rejectUnauthorized: false } // Если нужно отключить проверку SSL сертификата (не рекомендуется в production)
});

module.exports = pool;