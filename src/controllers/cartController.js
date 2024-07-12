import CartManager from '../Dao/cartManagerMongo.js';

const cartManager = new CartManager();

export default class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartManager.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.user.cart._id;
            const cart = await cartManager.getCartById(cartId);
            //console.log(cart);
            if (cart) {
                res.render('cart', { cart });
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }

    async addItemToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartManager.addItemToCart(cid, pid, quantity);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
    }

    async removeItemFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartManager.removeItemFromCart(cid, pid);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const clearedCart = await cartManager.clearCart(cid);
            res.json(clearedCart);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const purchaseResult = await cartManager.purchaseCart(cid);
            res.json(purchaseResult);
        } catch (error) {
            console.error('Error al procesar la compra del carrito:', error);
            res.status(500).json({ error: 'Error al procesar la compra del carrito' });
        }
    }
}
