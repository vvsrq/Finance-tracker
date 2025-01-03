const { and } = require('sequelize');
const User = require('../models/User');

async function createUser(req, res){
    try{
        const {id,name, password} = req.body;

        console.log("Тело запроса:", req.body);

        // if (name == null || password == null) {
        //     return res.status(400).json({ message: 'Не все поля заполнены!' });
        // }


        const newUser = await User.create({
            id,
            name,
            password,
        });

        console.log("Созданный пользователь:", newUser);

        req.session.userName = newUser.name;
        console.log(req.session)


        res.status(201).json({ message: 'Пользователь успешно создан' });
        
    }

    catch (error) {
        console.error("Ошибка при создании пользователя:", error);
      if (error.name === 'SequelizeUniqueConstraintError') { 
          return res.status(400).json({ message: 'Пользователь с таким Login уже существует' });
      }
      res.status(500).json({ message: 'Ошибка сервера' });
    }
}

module.exports = { createUser };