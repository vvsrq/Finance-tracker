const { and } = require('sequelize');
const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const path = require('path');
const uuid = require('uuid'); // Import uuid
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

async function enable2FA(req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const secret = speakeasy.generateSecret({ length: 20 });

    QRCode.toDataURL(secret.otpauth_url, async function (err, data_url) {
      if (err) {
        console.error('Ошибка при создании QR-кода:', err);
        return res.status(500).json({ message: 'Ошибка при создании QR-кода' });
      }

      user.secret2FAKey = secret.base32;
      await user.save();

      res.status(200).json({
        message: '2FA включен',
        qrCode: data_url,
        secret: secret.base32 // Remove secret before deployment
      });
    });
  } catch (error) {
    console.error('Ошибка при включении 2FA:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

async function loginUser(req, res) {
  try {
    const { name, password, token2FA } = req.body;

    // if (!name || !password) {
    //     return res.status(400).json({ message: 'Не все поля заполнены!' });
    // }

    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    if (user.secret2FAKey) {
      const verified = speakeasy.totp.verify({
        secret: user.secret2FAKey,
        encoding: 'base32',
        token: token2FA,
      });
      if (!verified) {
        return res.status(401).json({ message: 'Неверный код 2FA' });
      }
    }

    const sessionToken = uuid.v4();
    req.session.token = sessionToken;
    req.session.user = user;
    req.session.userId = user.id;
    req.session.userName = user.name1;

    await Session.destroy({ where: { userId: user.id } });
    const newSession = await Session.create({ userId: user.id });


    const payload = {
      userId: user.id,
      userName: user.name1,
      sessionId: newSession.id
    };
    const secretKey = process.env.JWT_SECRET;
    const options = {
      expiresIn: '24h',
    };
    const token = jwt.sign(payload, secretKey, options);
    console.log('Получен токен:', token);

    res.status(200).json({ message: 'Вход выполнен успешно', token });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = { loginUser, enable2FA };