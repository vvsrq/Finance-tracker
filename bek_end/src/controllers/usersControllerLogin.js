const { and } = require('sequelize');
const User = require('../models/User');

async function loginUser(req, res) {
    try {
      const { name, password } = req.body;
      console.log(req.body)

    // if (!name || !password) {
    //     return res.status(400).json({ message: 'Не все поля заполнены!' });
    // }

    const user = await User.findOne({ where: { name } });

        // Проверка, найден ли пользователь
        if (!user) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }


        if (password != user.password) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }


       // Устанавливаем сессию
         req.session.userId = user.id;
        req.session.userName = user.name1;

        // Отправляем успешный ответ
      res.status(200).json({ message: 'Вход выполнен успешно' });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

module.exports = { loginUser };