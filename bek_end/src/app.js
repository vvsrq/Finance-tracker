const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const sequelize = require('./config.js');
const Transaction = require('./models/Transaction.js');
const Category = require('./models/Category.js');
const usersRoutes = require('./routes/users.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const secret = crypto.randomBytes(32).toString('base64');

app.use(session({
  secret, 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    sameSite: 'strict', 
  },
}));

app.use('/users.js', usersRoutes);

app.use(express.static(path.join(__dirname, '..', '..', 'front_war')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_war', 'main.html'));
});



app.get('/users-page',(req,res)=>{
  res.sendFile(path.join(__dirname, '..', '..', 'front_war', 'users_page.html'));
}
)
//test commit


const PORT = 3000;

// const User = require('./models/User');

// async function testDatabaseConnection() {
//   try {
//     const users = await User.findAll();
//     console.log('Подключение к базе данных успешно!', users);
//   } catch (error) {
//     console.error('Ошибка подключения к базе данных:', error);
//   }
// }

// testDatabaseConnection();



app.listen(PORT, () => {
console.log(` http://localhost:${PORT}`);})
