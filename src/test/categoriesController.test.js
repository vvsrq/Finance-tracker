const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const Category = require('../models/Category');
const User = require('../models/User');

describe('Categories Controller', () => {
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

    it('should get all categories', async () => {
        const response = await request('http://localhost:3000')
            .get('/categories')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should create a new category', async () => {
        const response = await request('http://localhost:3000')
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Category', type: 'income' });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Test Category');
    });

    it('should get a category by ID', async function() { this.timeout(3000);{
        const category = await Category.create({ name: 'Test Category', type: 'income', userId: user });
        const response = await request('http://localhost:3000')
            .get(`/categories/${category.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('Test Category');
    }});

    it('should update a category by ID', async function() { this.timeout(3000); {
        const category = await Category.create({ name: 'Test Category', type: 'income', userId: user });
        const response = await request('http://localhost:3000')
            .put(`/categories/${category.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Category', type: 'expense' });

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('Updated Category');
    }});

    it('should delete a category by ID', async function() { this.timeout(3000); {
        const category = await Category.create({ name: 'Test Category', type: 'income', userId: user });
        const response = await request('http://localhost:3000')
            .delete(`/categories/${category.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Категория удалена');
    }});
});