import { Router } from 'express';
import ViewsController from '../controllers/viewsController.js';
import { isAuthenticated, isNotAuthenticated, isAdmin, isUser } from '../middleware/auth.js';

const router = Router();
const viewsController = new ViewsController();

router.get('/', viewsController.getProducts.bind(viewsController));
router.get('/products/:pid', viewsController.getProductById.bind(viewsController));
router.post('/products', isAuthenticated, isUser, viewsController.addProductToCart.bind(viewsController));
router.get('/realtimeproducts', isAuthenticated, isAdmin, viewsController.getRealTimeProducts.bind(viewsController));
router.get('/chat', isAuthenticated, isUser, viewsController.getChat.bind(viewsController));
router.get('/login', isNotAuthenticated, viewsController.getLogin.bind(viewsController));
router.get('/register', isNotAuthenticated, viewsController.getRegister.bind(viewsController));

export default router;
