import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/app.js';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('Cart Routes', () => {
    let cartId;

    before((done) => {
        mongoose.connection.collections.carts.drop(() => {
            done();
        });
    });

    it('should create a new cart', (done) => {
        chai.request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('_id');
                cartId = res.body._id;
                done();
            });
    });

    it('should add a product to the cart', (done) => {
        chai.request(app)
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 2 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('items');
                expect(res.body.items[0]).to.have.property('productId', productId);
                done();
            });
    });

    it('should return the cart with items', (done) => {
        chai.request(app)
            .get(`/api/carts/${cartId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('items');
                expect(res.body.items).to.be.an('array').that.is.not.empty;
                done();
            });
    });
});
