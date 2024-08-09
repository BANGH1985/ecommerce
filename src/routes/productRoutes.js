// productRoutes.js

import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import { isAuthenticated, isAdmin, isPremium, isOwnerOrAdmin } from '../middleware/auth.js';

const router = Router();
const productController = new ProductController();

router.get('/products', productController.getProducts);
router.get('/products/:pid', productController.getProductById);
router.post('/products', isAuthenticated, isPremium, productController.addProduct); // Solo premium y admin pueden crear
router.put('/products/:pid', isAuthenticated, isOwnerOrAdmin, productController.updateProduct); // Solo el propietario o admin pueden actualizar
router.delete('/products/:pid', isAuthenticated, isOwnerOrAdmin, productController.deleteProduct); // Solo el propietario o admin pueden eliminar

export default router;
