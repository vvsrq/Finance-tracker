const request = require('supertest');
const { expect } = require('chai');
const app = require('../app.js'); // Подключите ваш app.js
const User = require('../models/User'); // Подключите вашу модель User
const Session = require('../models/Session');

describe('Маршруты аутентификации', () => {

    beforeEach(async () => {
    //  Очистите таблицы Users и Sessions перед каждым тестом
        await User.destroy({ where: {} });
        await Session.destroy({ where: {} });
    });

    it('Успешная регистрация нового пользователя', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Пользователь успешно создан');
        expect(response.body.token).to.be.a('string'); // Проверяем, что вернулся токен

        // Проверяем, что пользователь создан в базе данных
        const user = await User.findOne({ where: { name: 'testuser' } });
        expect(user).to.not.be.null;
    });


    it('Неуспешная регистрация (имя пользователя уже существует)', async () => {
        // Сначала создаем пользователя
        await request(app)
            .post('/users')
            .send({ name: 'existinguser', password: 'password123' });

        // Попытка создать пользователя с тем же именем
        const response = await request(app)
            .post('/users')
            .send({ name: 'existinguser', password: 'anotherpassword' });

        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Ошибка сервера');
    });

    it('Успешный вход существующего пользователя', async () => {
        // Сначала создаем пользователя
        await request(app)
            .post('/users')
            .send({ name: 'testuser', password: 'password123' });

        // Выполняем вход
        const response = await request(app)
            .post('/users/login')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Вход выполнен успешно');
        expect(response.body.token).to.be.a('string');

    });

    it('Неуспешный вход (неверный логин)', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({ name: 'nonexistentuser', password: 'password123' });

        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Неверное имя пользователя или пароль');
    });


    it('Неуспешный вход (неверный пароль)', async () => {
        // Сначала создаем пользователя
        await request(app)
            .post('/users')
            .send({ name: 'testuser', password: 'password123' });

        // Попытка войти с неверным паролем
        const response = await request(app)
            .post('/users/login')
            .send({ name: 'testuser', password: 'wrongpassword' });

        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Неверное имя пользователя или пароль');
    });
});