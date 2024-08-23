// productRoutes.test.js

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/app.js';  // Asegúrate de que la ruta sea correcta
import ProductManager from '../src/Dao/productManagerMongo.js';
import mongoose from 'mongoose';
import supertest from 'supertest';

const request = supertest(app);
const expect = chai.expect;

chai.use(chaiHttp);

describe('Product Routes', () => {
    let testProductId;

    before(async () => {
        // Conectar a la base de datos de prueba
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });
    it('should get all products', async () => {
        const res = await request.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.be.an('array');
    });

    it('should add a new product', async () => {
        const newProduct = {
            name: 'Test Product',
            description: 'A test product description',
            price: 20.99,
            category: 'Test Category',
            stock: 100
        };

        const res = await request.post('/api/products')
            .send(newProduct);

        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.have.property('_id');

        testProductId = res.body.payload._id;
    });

    it('should delete a product by id', async () => {
        const res = await request.delete(`/api/products/${testProductId}`);
        expect(res.status).to.equal(204);
    });
});
