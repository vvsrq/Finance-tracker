const jwt = require('jsonwebtoken');
const path = require('path');
const Session = require('../models/Session');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') })

function authMiddleware(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('hello');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your_secret_key';
    const decoded = jwt.verify(token, secretKey);
    console.log('hello world');

    // const session = await Session.findOne({ where: { id: decoded.sessionId, userId: decoded.userId } });
    // console.log(session);

    // if (!session) {
    //   return res.status(401).json({ message: 'Сессия не найдена, пожалуйста авторизуйтесь' });
    // }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

module.exports = authMiddleware;