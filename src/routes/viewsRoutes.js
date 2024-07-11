import { Router } from 'express';
import ViewsController from '../controllers/viewsController.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();
const viewsController = new ViewsController();

router.get('/', viewsController.getProducts.bind(viewsController));
router.get('/products/:pid', viewsController.getProductById.bind(viewsController));
router.post('/products', viewsController.addProductToCart.bind(viewsController));
router.get('/realtimeproducts', viewsController.getRealTimeProducts.bind(viewsController));
router.get('/chat', viewsController.getChat.bind(viewsController));
router.get('/login', isNotAuthenticated, viewsController.getLogin.bind(viewsController));
router.get('/register', isNotAuthenticated, viewsController.getRegister.bind(viewsController));

export default router;
