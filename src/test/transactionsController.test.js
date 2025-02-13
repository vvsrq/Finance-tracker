const request = require('supertest');
const { expect } = require('chai');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

describe('Transactions Controller', () => {
    let user;
    let token;
    let categoryId = "1";

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

    it('should create a new category', async () => {
        const response = await request('http://localhost:3000')
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Category', type: 'income' });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Test Category');
    });

    it('should get all transactions', async () => {
        const response = await request('http://localhost:3000')
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should create a new transaction', async function(){ this.timeout(3000); {
        const response = await request('http://localhost:3000')
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 100, date: '2023-10-01', categoryId, description: 'Test Transaction' });

        expect(response.status).to.equal(201);
        expect(response.body.amount).to.equal('100.00');
    }});

    it('should get a transaction by ID', async function(){ this.timeout(3000); {
        const transaction = await Transaction.create({ amount: 100, date: '2023-10-01', categoryId, userId: user });
        const response = await request('http://localhost:3000')
            .get(`/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.amount).to.equal('100.00');
    }});

    it('should update a transaction by ID', async function(){ this.timeout(3000); {
        const transaction = await Transaction.create({ amount: 100, date: '2023-10-01', categoryId, userId: user });
        const response = await request('http://localhost:3000')
            .put(`/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 200, date: '2023-10-02', categoryId, description: 'Updated Transaction' });

        expect(response.status).to.equal(200);
        expect(response.body.amount).to.equal(200);
    }});

    it('should delete a transaction by ID', async function(){ this.timeout(3000); {
        const transaction = await Transaction.create({ amount: 100, date: '2023-10-01', categoryId, userId: user });
        const response = await request('http://localhost:3000')
            .delete(`/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(204);
    }});
});