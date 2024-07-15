import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = Router();
const productController = new ProductController();

router.get('/products', productController.getProducts);
router.get('/products/:pid', productController.getProductById);
router.post('/products', isAuthenticated, isAdmin, productController.addProduct);
router.put('/products/:pid', isAuthenticated, isAdmin, productController.updateProduct);
router.delete('/products/:pid', isAuthenticated, isAdmin, productController.deleteProduct);

export default router;
