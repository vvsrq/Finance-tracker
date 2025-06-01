const express = require('express');
const session = require('express-session');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const path = require('path');
const crypto = require('crypto');
const sequelize = require('./config.js');
const Transaction = require('./models/Transaction.js');
const Category = require('./models/Category.js');
const usersRoutes = require('./routes/users.js');
const loginRoutes = require('./routes/login.js')
const transactionsRoutes = require('./routes/transactions.js');
const categoriesRoutes = require('./routes/categories.js');
const reportsRoutes = require('./routes/reports.js');
const dotenv = require('dotenv');

// require('dotenv').config({ path: path.join(__dirname, '..','.env') });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

collectDefaultMetrics();

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

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Продолжительность HTTP-запроса в секундах',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 1.5, 2]
});

app.use((req, res, next) => {
  const startEpoch = Date.now();
  res.on('finish', () => {
    const responseTimeInSeconds = (Date.now() - startEpoch) / 1000;
    const route = req.route?.path || req.originalUrl || req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route, String(res.statusCode))
      .observe(responseTimeInSeconds);
  });
  next();
});

app.use('/users', usersRoutes);
app.use('/login.js', loginRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/reports', reportsRoutes)

app.use(express.static(path.join(__dirname, '..', 'front_war')));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_war', 'main.html'));
});

app.get('/2fa', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_war', '2fa_page.html'));
});

app.get('/calc', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_war', 'calc.html'));
});

app.get('/error', (req, res) => {
  res.status(500).send('Simulated error');
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_war', 'profile.html'));
}
)
//test commit


const PORT = 4000;

async function startServer() {
  try {
      await sequelize.sync({ force: true });  
      console.log('База данных синхронизирована');
  } catch (error) {
      console.error('Ошибка при запуске сервера:', error);
  }
}

startServer();



const server = app.listen(PORT, () => {
  console.log(` http://localhost:${PORT}`);
})

module.exports = server;