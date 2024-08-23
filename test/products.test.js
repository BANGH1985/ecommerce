import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/app.js';  // Asegúrate de que la ruta sea correcta
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('Product Routes', () => {
    before((done) => {
        mongoose.connection.collections.products.drop(() => {
            done();
        });
    });

    it('should GET all products', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status', 'success');
                expect(res.body.payload).to.be.an('array');
                done();
            });
    });

    it('should POST a new product (Admin or Premium only)', (done) => {
        const product = {
            title: 'Test Product',
            description: 'This is a test product',
            price: 10,
            stock: 5,
            code: 'TP001',
            category: 'test',
            owner: 'admin'
        };

        chai.request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)  // Asumiendo que tienes una forma de obtener el token
            .send(product)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('status', 'success');
                expect(res.body.payload).to.have.property('_id');
                done();
            });
    });

    it('should not POST a new product without required fields', (done) => {
        const product = {
            title: 'Incomplete Product',
            // Missing description, price, stock, etc.
        };

        chai.request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(product)
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('status', 'error');
                done();
            });
    });
});
