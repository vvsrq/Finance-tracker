const { and } = require('sequelize');
const User = require('../models/User');

async function createUser(req, res){
    try{
        const {id,name, password} = req.body;

        console.log("Тело запроса:", req.body);

        // if (!name || !password) {
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

module.exports = {createUser, logoutUser }; //getProfile,