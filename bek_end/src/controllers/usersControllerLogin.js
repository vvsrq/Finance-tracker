const { and } = require('sequelize');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function loginUser(req, res) {
  try {
    const { name, password } = req.body;
    console.log(req.body)

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


    req.session.userId = user.id;
    req.session.userName = user.name1;

    res.status(200).json({ message: 'Вход выполнен успешно' });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = { loginUser };