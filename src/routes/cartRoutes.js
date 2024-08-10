import { Router } from 'express';
import CartController from '../controllers/cartController.js';
import { isAuthenticated, isUserOrPremium, isNotOwner } from '../middleware/auth.js'; 

const router = Router();
const cartController = new CartController();

router.post('/', isAuthenticated, isUserOrPremium, cartController.createCart);
router.get('/:cid', isAuthenticated, isUserOrPremium, cartController.getCartById);
router.post('/:cid/products/:pid', isAuthenticated, isUserOrPremium, isNotOwner, cartController.addItemToCart); 
router.delete('/:cid/products/:pid', isAuthenticated, isUserOrPremium, cartController.removeItemFromCart);
router.delete('/:cid', isAuthenticated, isUserOrPremium, cartController.clearCart);
router.get('/:cid/purchase', isAuthenticated, isUserOrPremium, cartController.purchaseCart);
router.post('/:cid/purchase/pay', isAuthenticated, isUserOrPremium, cartController.payForCart);
router.post('/:cid/purchase/receipt', isAuthenticated, isUserOrPremium, cartController.sendReceipt);

export default router;
