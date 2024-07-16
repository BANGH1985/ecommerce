import { Router } from 'express';
import CartController from '../controllers/cartController.js';
import { isAuthenticated, isUser } from '../middleware/auth.js';

const router = Router();
const cartController = new CartController();

router.post('/', isAuthenticated, isUser, cartController.createCart);
router.get('/:cid', isAuthenticated, isUser, cartController.getCartById);
router.post('/:cid/products/:pid', isAuthenticated, isUser, cartController.addItemToCart);
router.delete('/:cid/products/:pid', isAuthenticated, isUser, cartController.removeItemFromCart); 
router.delete('/:cid', isAuthenticated, isUser, cartController.clearCart);
router.get('/:cid/purchase', isAuthenticated, isUser, cartController.purchaseCart);
router.post('/:cid/purchase/pay', isAuthenticated, isUser, cartController.payForCart);
router.post('/:cid/purchase/receipt', isAuthenticated, isUser, cartController.sendReceipt);


export default router;
