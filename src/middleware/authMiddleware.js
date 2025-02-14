const jwt = require('jsonwebtoken');
const path = require('path');
const Session = require('../models/Session');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') })

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('hello');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your_secret_key';
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded токен:", decoded);
    console.log( decoded.userId);


    const session = await Session.findOne({ where: { id: decoded.sessionId } });
    console.log(session.id);

    if (!session) {
      console.log('Сессия не найдена, пожалуйста авторизуйтесь');
      return res.status(401).json({ message: 'Сессия не найдена, пожалуйста авторизуйтесь' });
    }

    req.user = decoded;
    console.log("Decoded токен:", decoded);
    next();
  } catch (error) {
    console.log('hello loshara');
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

module.exports = authMiddleware;