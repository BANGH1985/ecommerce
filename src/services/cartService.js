import CartManager from '../Dao/cartManagerMongo.js';

const cartManager = new CartManager();

export default class CartService {
    async createCart() {
        return await cartManager.createCart();
    }

    async getCartById(cartId) {
        return await cartManager.getCartById(cartId);
    }

    async addItemToCart(cartId, productId, quantity) {
        return await cartManager.addItemToCart(cartId, productId, quantity);
    }

    async removeItemFromCart(cartId, productId) {
        return await cartManager.removeItemFromCart(cartId, productId);
    }

    async clearCart(cartId) {
        return await cartManager.clearCart(cartId);
    }

    async purchaseCart(cartId) {
        return await cartManager.purchaseCart(cartId);
    }
}
