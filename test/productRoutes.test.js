import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js'; // Asegúrate de que esta ruta sea la correcta a tu archivo principal de Express


describe('Product Routes', () => {
  it('should get all products', (done) => {
    request(app)
      .get('/api/products')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should add a new product', (done) => {
    request(app)
      .post('/api/products')
      .send({
        // Datos de prueba para crear un nuevo producto
        name: 'Test Product',
        price: 100,
        description: 'This is a test product',
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id'); // Ajusta esto según la estructura de tu respuesta
        done();
      });
  });

  it('should get a product by ID', (done) => {
    const productId = '66c8e627d57c3b15551a212a'; // Usa un ID de prueba válido
    request(app)
      .get(`/api/products/${productId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('product');
        expect(res.body.product).to.have.property('id', productId);
        done();
      });
  });

  it('should update a product', (done) => {
    const productId = '66c8e627d57c3b15551a212a'; // Usa un ID de prueba válido
    request(app)
      .put(`/api/products/${productId}`)
      .send({
        // Datos de prueba para actualizar el producto
        name: 'Updated Product',
        price: 120,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('updated');
        done();
      });
  });

  it('should delete a product', (done) => {
    const productId = '66c8e627d57c3b15551a212a'; // Usa un ID de prueba válido
    request(app)
      .delete(`/api/products/${productId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('deleted');
        done();
      });
  });
});
