import { Router } from 'express';
import CartController from '../controllers/cartController.js';

const router = Router();
const cartController = new CartController();

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/products/:pid', cartController.addItemToCart);
router.delete('/:cid/product/:pid', cartController.removeItemFromCart);
router.delete('/:cid', cartController.clearCart);
router.post('/:cid/purchase', cartController.purchaseCart);

export default router;
