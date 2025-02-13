const { and } = require('sequelize');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname,'../../../.env') })

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Ошибка при хешировании пароля:', error);
    throw error;
  }
}

async function createUser(req, res){
    try{
        const {id,name, password} = req.body;

        // if (!name || !password) {
        //     return res.status(400).json({ message: 'Не все поля заполнены!' });
        // }

        const hashedPassword = await hashPassword(password);


        const newUser = await User.create({
            id,
            name,
            password: hashedPassword,
        });


        req.session.userName = newUser.name;

        const payload = {
          userId: newUser.id,
          userName: newUser.name,
        };
         const secretKey = process.env.JWT_SECRET || 'your_secret_key';
          const options = {
                expiresIn: '24h',
           };
        const token = jwt.sign(payload, secretKey, options);
    
        res.status(201).json({ message: 'Пользователь успешно создан',token });
    }

    catch (error) {
        console.error("Ошибка при создании пользователя:", error);
      if (error.name === 'SequelizeUniqueConstraintError') { 
          return res.status(400).json({ message: 'Пользователь с таким Login уже существует' });
      }
      res.status(500).json({ message: 'Ошибка сервера' });
    }
}

async function enable2FA(req, res) {
  try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Генерируем секретный ключ
      const secret = speakeasy.generateSecret({ length: 20 });

      // Создаем QR-код
      QRCode.toDataURL(secret.otpauth_url, async function (err, data_url) {
          if (err) {
              console.error('Ошибка при создании QR-кода:', err);
              return res.status(500).json({ message: 'Ошибка при создании QR-кода' });
          }

          // Сохраняем секретный ключ в базу данных
          user.secret2FAKey = secret.base32;
          await user.save();

          res.status(200).json({
              message: '2FA включен',
              qrCode: data_url,
              secret: secret.base32 // Отдаем секрет для отладки (в production убрать!)
          });
      });
  } catch (error) {
      console.error('Ошибка при включении 2FA:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
}


// async function getProfile(req, res) {
//     console.log(req.body)
//     try {
//         const userId = req.session.userId;
//         const userName = req.session.userName;
//         console.log(userId,userName)
//         const transactions = await Transaction.findAll({ where: { userId } });

//        res.status(200).json({ userId, userName, transactions });
//         } catch (error) {
//         console.error('Ошибка получения профиля:', error);
//        res.status(500).json({ message: 'Ошибка сервера' });
//     }
// }

async function logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Ошибка при выходе:', err);
        res.status(500).json({message:"Ошибка сервера"});
      } else {
           res.status(200).json({message: "Выход выполнен успешно"});
      }
    });
}

module.exports = {createUser, logoutUser, enable2FA }; 