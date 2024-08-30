import { expect } from 'chai';
import sinon from 'sinon';
import ProductController from '../src/controllers/productController.js';
import ProductService from '../src/services/productService.js';

describe('ProductController Tests', () => {
  let productController;
  let productServiceStub;
  let req;
  let res;

  beforeEach(() => {
    // Crear una nueva instancia del ProductController
    productController = new ProductController();

    // Crear un stub para ProductService
    productServiceStub = sinon.stub(ProductService.prototype);

    // Simulamos los objetos req y res
    req = {
      params: {},
      body: {},
      query: {},
      session: { user: { role: 'admin' } }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore(); // Restaurar los stubs después de cada prueba
  });

  describe('getProducts', () => {
    it('should get a list of products', async () => {
      const fakeProducts = { docs: [], totalPages: 1, page: 1, hasPrevPage: false, hasNextPage: false };

      // Configurar el stub para devolver una lista de productos falsa
      productServiceStub.getProducts.resolves(fakeProducts);

      await productController.getProducts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        payload: fakeProducts.docs,
        totalPages: fakeProducts.totalPages,
        prevPage: fakeProducts.hasPrevPage ? fakeProducts.prevPage : null,
        nextPage: fakeProducts.hasNextPage ? fakeProducts.nextPage : null,
        page: fakeProducts.page,
        hasPrevPage: fakeProducts.hasPrevPage,
        hasNextPage: fakeProducts.hasNextPage
      })).to.be.true;
    });

    it('should return 500 if there is an error fetching products', async () => {
      // Configurar el stub para lanzar un error
      productServiceStub.getProducts.rejects(new Error('Internal Server Error'));

      await productController.getProducts(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ status: 'error', message: 'Internal Server Error', error: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('addProduct', () => {
    it('should add a new product', async () => {
      const newProduct = { _id: '12345', name: 'Product Test' };
      req.body = { name: 'Product Test' };

      // Configurar el stub para devolver el nuevo producto
      productServiceStub.addProduct.resolves(newProduct);

      await productController.addProduct(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ status: 'success', payload: newProduct })).to.be.true;
    });

    it('should return 500 if there is an error adding a product', async () => {
      req.body = { name: 'Product Test' };

      // Configurar el stub para lanzar un error
      productServiceStub.addProduct.rejects(new Error('Internal Server Error'));

      await productController.addProduct(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ status: 'error', message: 'Error interno del servidor', error: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updatedProduct = { _id: '12345', name: 'Updated Product' };
      req.params = { productId: '12345' };
      req.body = { name: 'Updated Product' };

      // Configurar el stub para devolver el producto actualizado
      productServiceStub.updateProduct.resolves(updatedProduct);

      await productController.updateProduct(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'success', payload: updatedProduct })).to.be.true;
    });

    it('should return 500 if there is an error updating a product', async () => {
      req.params = { productId: '12345' };
      req.body = { name: 'Updated Product' };

      // Configurar el stub para lanzar un error
      productServiceStub.updateProduct.rejects(new Error('Internal Server Error'));

      await productController.updateProduct(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ status: 'error', message: 'Internal Server Error', error: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      req.params = { productId: '12345' };

      // Configurar el stub para simular la eliminación exitosa
      productServiceStub.deleteProduct.resolves();

      await productController.deleteProduct(req, res);

      expect(res.status.calledWith(204)).to.be.true;
      expect(res.json.calledWith({ status: 'success' })).to.be.true;
    });

    it('should return 500 if there is an error deleting a product', async () => {
      req.params = { productId: '12345' };

      // Configurar el stub para lanzar un error
      productServiceStub.deleteProduct.rejects(new Error('Internal Server Error'));

      await productController.deleteProduct(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ status: 'error', message: 'Internal Server Error', error: 'Internal Server Error' })).to.be.true;
    });
  });
});
