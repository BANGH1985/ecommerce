// cartRoutes.test.js

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/app.js';  // Asegúrate de que la ruta sea correcta
import mongoose from 'mongoose';
import supertest from 'supertest';

const request = supertest(app);
const expect = chai.expect;

chai.use(chaiHttp);

describe('Cart Routes', () => {
    let testCartId;
    let testProductId;

    before(async () => {
        // Conectar a la base de datos de prueba
        await mongoose.connect(process.env.MONGODB_URI_TEST);

        // Crear un producto de prueba
        const productRes = await request.post('/api/products').send({
            name: 'Test Product',
            description: 'A test product description',
            price: 20.99,
            category: 'Test Category',
            stock: 100
        });

        testProductId = productRes.body.payload._id;
    });

    it('should create a new cart', async () => {
        const res = await request.post('/api/carts');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');

        testCartId = res.body._id;
    });

    it('should add a product to the cart', async () => {
        const res = await request.post(`/api/carts/${testCartId}/product/${testProductId}`)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body.items).to.be.an('array');
        expect(res.body.items[0]).to.have.property('productId');
        expect(res.body.items[0].productId).to.equal(testProductId);
    });

    it('should remove a product from the cart', async () => {
        const res = await request.delete(`/api/carts/${testCartId}/product/${testProductId}`);
        expect(res.status).to.equal(200);
        expect(res.body.items).to.be.an('array').that.is.empty;
    });
});
