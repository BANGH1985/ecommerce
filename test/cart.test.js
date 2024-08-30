import { expect } from 'chai';
import sinon from 'sinon';
import CartController from '../src/controllers/cartController.js';
import CartService from '../src/services/cartService.js';

describe('CartController Tests', () => {
  let cartController;
  let cartServiceStub;
  let req;
  let res;

  beforeEach(() => {
    // Creamos una nueva instancia del CartController
    cartController = new CartController();
    
    // Creamos un stub para CartService
    cartServiceStub = sinon.stub(CartService.prototype);

    // Simulamos los objetos req y res
    req = {
      params: {},
      body: {},
      user: { cart: { _id: '12345' } },
      session: { user: {} }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      render: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore(); // Restauramos los stubs después de cada prueba
  });

  describe('getCartById', () => {
    it('should get cart by ID', async () => {
      const fakeCart = { _id: '12345', items: [] };

      // Configuramos el stub para devolver un carrito falso
      cartServiceStub.getCartById.resolves(fakeCart);

      await cartController.getCartById(req, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.firstCall.args[0]).to.equal('cart');
      expect(res.render.firstCall.args[1]).to.deep.equal({ cart: fakeCart });
    });

    it('should return 404 if cart not found', async () => {
      // Configuramos el stub para devolver null simulando que no se encuentra el carrito
      cartServiceStub.getCartById.resolves(null);

      await cartController.getCartById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Carrito no encontrado' })).to.be.true;
    });
  });

  describe('addItemToCart', () => {
    it('should add a product to the cart', async () => {
      const updatedCart = { _id: '12345', items: [{ productId: '67890', quantity: 1 }] };
      req.params = { cid: '12345', pid: '67890' };
      req.body = { quantity: 1 };

      // Configuramos el stub para devolver el carrito actualizado
      cartServiceStub.addItemToCart.resolves(updatedCart);

      await cartController.addItemToCart(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedCart)).to.be.true;
    });

    it('should return 500 if there is an error adding the product', async () => {
      req.params = { cid: '12345', pid: '67890' };
      req.body = { quantity: 1 };

      // Configuramos el stub para lanzar un error
      cartServiceStub.addItemToCart.rejects(new Error('Error al agregar el artículo al carrito'));

      await cartController.addItemToCart(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al agregar el artículo al carrito' })).to.be.true;
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove a product from the cart', async () => {
      const updatedCart = { _id: '12345', items: [] };
      req.params = { cid: '12345', pid: '67890' };

      // Configuramos el stub para devolver el carrito actualizado
      cartServiceStub.removeItemFromCart.resolves(updatedCart);

      await cartController.removeItemFromCart(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedCart)).to.be.true;
    });

    it('should return 500 if there is an error removing the product', async () => {
      req.params = { cid: '12345', pid: '67890' };

      // Configuramos el stub para lanzar un error
      cartServiceStub.removeItemFromCart.rejects(new Error('Error al eliminar el artículo del carrito'));

      await cartController.removeItemFromCart(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al eliminar el artículo del carrito' })).to.be.true;
    });
  });
});
