const jwt = require('jsonwebtoken');
const path = require('path');
const Session = require('../models/Session');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') })

async function newSessionMiddleware(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    try {
        const session = await Session.findOne({ where: { id: decoded.sessionId, userId: decoded.userId } });
        console.log(session);

        if (!session) {
            return res.status(401).json({ message: 'Сессия не найдена, пожалуйста авторизуйтесь' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Неверный токен' });
    }
}

module.exports = newSessionMiddleware;