import { Router } from 'express';
import ViewsController from '../controllers/viewsController.js';
import { isAuthenticated, isAdminOrPremium, isUser, isNotAuthenticated, isUserOrPremium } from '../middleware/auth.js';

const router = Router();
const viewsController = new ViewsController();

// Ruta para todos los usuarios autenticados
router.get('/', viewsController.getProducts.bind(viewsController));
// Ruta para obtener un producto por ID
router.get('/products/:pid', viewsController.getProductById.bind(viewsController));
// Ruta para agregar un producto al carrito (solo usuarios regulares)
router.post('/products', isAuthenticated, isUser, viewsController.addProductToCart.bind(viewsController));
// Ruta para ver productos en tiempo real (solo para admin y premium)
router.get('/realtimeproducts', isAuthenticated, isAdminOrPremium, viewsController.getRealTimeProducts.bind(viewsController));
// Ruta para el chat (solo para user y premium)
router.get('/chat', isAuthenticated, isUserOrPremium, viewsController.getChat.bind(viewsController));
// Ruta para la página de login (solo usuarios no autenticados)
router.get('/login', isNotAuthenticated, viewsController.getLogin.bind(viewsController));
// Ruta para la página de registro (solo usuarios no autenticados)
router.get('/register', isNotAuthenticated, viewsController.getRegister.bind(viewsController));

router.get('/upload-documents', isAuthenticated, (req, res) => {
    res.render('uploadDocuments', { user: req.user });
});

export default router;
