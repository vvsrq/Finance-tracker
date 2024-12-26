const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          
  host: '',          
  database: 'finance', 
  password: 'Mapa19790',  
  port: 5432,                
  
});

module.exports = pool;