import { expect } from 'chai';
import sinon from 'sinon';
import * as userController from '../src/controllers/userController.js';
import UserService from '../src/services/userService.js';

describe('UserController Tests', () => {
  let userServiceStub;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Crear un stub para UserService
    userServiceStub = sinon.stub(UserService.prototype);

    // Simulamos los objetos req y res
    req = {
      params: {},
      body: {},
      session: { user: { role: 'user', _id: '12345' } },
      isAuthenticated: sinon.stub().returns(true),
      logout: sinon.stub(),
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      redirect: sinon.stub(),
      send: sinon.stub(),
      render: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore(); // Restaurar los stubs después de cada prueba
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      req.body = { first_name: 'John', last_name: 'Doe', age: 30, email: 'john@example.com', password: 'password123' };

      // Configurar stubs para el servicio de usuario
      userServiceStub.findUserByEmail.resolves(null);
      userServiceStub.createUser.resolves({ _id: '12345' });
      userServiceStub.createCart.resolves({ _id: '54321' });
      userServiceStub.updateUserCart.resolves();

      await userController.registerUser(req, res);

      expect(res.redirect.calledWith('/login?success=Usuario registrado correctamente. Por favor, inicie sesión.')).to.be.true;
    });

    it('should redirect with an error if email is already in use', async () => {
      req.body = { email: 'john@example.com' };

      // Configurar el stub para devolver un usuario existente
      userServiceStub.findUserByEmail.resolves({ email: 'john@example.com' });

      await userController.registerUser(req, res);

      expect(res.redirect.calledWith('/register?error=El email ya está en uso.')).to.be.true;
    });

    it('should handle errors and redirect with an error message', async () => {
      req.body = { email: 'john@example.com' };

      // Configurar el stub para lanzar un error
      userServiceStub.findUserByEmail.rejects(new Error('Error interno'));

      await userController.registerUser(req, res);

      expect(res.redirect.calledWith('/register?error=Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.')).to.be.true;
    });
  });

  describe('logoutUser', () => {
    it('should logout the user and redirect to login', () => {
      req.logout.callsArgWith(0, null); // Simula la función de logout sin error

      userController.logoutUser(req, res);

      expect(req.logout.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/login?success=Sesión cerrada correctamente.')).to.be.true;
    });

    it('should handle errors during logout', () => {
      const error = new Error('Logout error');
      req.logout.callsArgWith(0, error); // Simula un error en el logout

      userController.logoutUser(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('changeRole', () => {
    it('should change the user role successfully', async () => {
      req.params = { uid: '12345' };
      req.body = { role: 'premium' };
      const user = { _id: '12345', role: 'user' };

      // Configurar stubs para el servicio de usuario
      userServiceStub.findUserById.resolves(user);
      userServiceStub.updateUserRole.resolves();

      await userController.changeRole(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Rol cambiado exitosamente' })).to.be.true;
    });

    it('should return 404 if the user is not found', async () => {
      req.params = { uid: '12345' };
      req.body = { role: 'premium' };

      // Configurar el stub para devolver null (usuario no encontrado)
      userServiceStub.findUserById.resolves(null);

      await userController.changeRole(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no encontrado' })).to.be.true;
    });

    it('should return 500 if there is an error changing the role', async () => {
      req.params = { uid: '12345' };
      req.body = { role: 'premium' };

      // Configurar el stub para lanzar un error
      userServiceStub.findUserById.rejects(new Error('Error interno'));

      await userController.changeRole(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al cambiar el rol' })).to.be.true;
    });
  });
});
