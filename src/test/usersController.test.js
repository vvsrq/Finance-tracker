const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Session = require('../models/Session.js');


describe('Users Controller', function () {
    this.timeout(10000);
    let user;
    let token;


    it('should create a new user', async () => {
        this.timeout(3000);
        const response = await request('http://localhost:3000')
            .post('/users')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Пользователь успешно создан');
        expect(response.body.token).to.be.a('string');

    });

    it('should login a user', async () => {
        const response = await request('http://localhost:3000')
            .post('/login.js')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Вход выполнен успешно');
        expect(response.body.token).to.be.a('string');
    });

    it('should not login with incorrect password', async () => {
        const response = await request('http://localhost:3000')
            .post('/login.js')
            .send({ name: 'testuser', password: 'wrongpassword' });

        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Неверное имя пользователя или пароль');
    });

    it('should logout a user', async () => {
        const response = await request('http://localhost:3000')
            .get('/users/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Выход выполнен успешно');
    });

    it('should not create a user with existing name', async () => {
        this.timeout(3000);
        const response = await request('http://localhost:3000')
            .post('/users')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Пользователь с таким Login уже существует');
    });
});