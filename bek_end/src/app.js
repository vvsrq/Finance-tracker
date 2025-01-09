const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const sequelize = require('./config.js');
const Transaction = require('./models/Transaction.js');
const Category = require('./models/Category.js');
const usersRoutes = require('./routes/users.js');
const loginRoutes = require('./routes/login.js')
const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');

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
app.use('/login.js', loginRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/categories', categoriesRoutes);

app.use(express.static(path.join(__dirname, '..', '..', 'front_war')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front_war', 'main.html'));
});



app.get('/users-page',(req,res)=>{
  res.sendFile(path.join(__dirname, '..', '..', 'front_war', 'users_page.html'));
}
)

app.get('/profile',(req,res)=>{
  res.sendFile(path.join(__dirname, '..', '..', 'front_war', 'profile.html'));
}
)
//test commit


const PORT = 3000;

// async function startServer() {
//   try {
//       await sequelize.sync({ force: true });  
//       console.log('База данных синхронизирована');
//   } catch (error) {
//       console.error('Ошибка при запуске сервера:', error);
//   }
// }

// startServer();



app.listen(PORT, () => {
console.log(` http://localhost:${PORT}`);})
