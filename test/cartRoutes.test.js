import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js'; // Asegúrate de que esta ruta sea la correcta a tu archivo principal de Express

describe('Cart Routes', () => {
  it('should create a new cart', (done) => {
    request(app)
      .post('/api/carts')
      .send({
        // Datos de prueba para crear un nuevo carrito
        userId: '66c8e5b8d57c3b15551a2102',
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('cartId'); // Ajusta esto según la estructura de tu respuesta
        done();
      });
  });

  it('should get a cart by ID', (done) => {
    const cartId = '66c8e5b8d57c3b15551a2104'; // Usa un ID de prueba válido
    request(app)
      .get(`/api/carts/${cartId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('cart');
        expect(res.body.cart).to.have.property('id', cartId);
        done();
      });
  });

  it('should add an item to the cart', (done) => {
    const cartId = '66c8e5b8d57c3b15551a2104'; // Usa un ID de prueba válido
    request(app)
      .post(`/api/carts/${cartId}/items`)
      .send({
        productId: 'test-product-id',
        quantity: 2,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('items');
        expect(res.body.items).to.be.an('array');
        done();
      });
  });
});
