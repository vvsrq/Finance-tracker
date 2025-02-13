// src/test/reportsController.test.js
const request = require('supertest');
const { expect } = require('chai');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
require('./testSetup'); // Импортируем testSetup.js

describe('Reports Controller', () => {
    let user;
    let token;

    it('should create a new user', async () => {
        const response = await request('http://localhost:3000')
            .post('/users')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Пользователь успешно создан');

    });

    it('should login a user', async () => {
        const response = await request('http://localhost:3000')
            .post('/login.js')
            .send({ name: 'testuser', password: 'password123' });

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Вход выполнен успешно');
        expect(response.body.token).to.be.a('string');
        token = response.body.token;
        user = "1";
    });

    it('should get category report', async () => {
        const response = await request('http://localhost:3000')
            .get('/reports/category')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should get monthly report', async () => {
        const response = await request('http://localhost:3000')
            .get('/reports/monthly')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
});