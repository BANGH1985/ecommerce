import { Router } from 'express';
import ProductController from '../controllers/productController.js';

const router = Router();
const productController = new ProductController();

router.get('/products', productController.getProducts);
router.get('/products/:pid', productController.getProductById);
router.post('/products', productController.addProduct);
router.put('/products/:pid', productController.updateProduct);
router.delete('/products/:pid', productController.deleteProduct);

export default router;
