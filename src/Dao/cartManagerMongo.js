import Cart from '../models/carts.model.js';
import Product from '../models/products.model.js';

export default class CartManager {
    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error.message);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate("items.productId")
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error.message);
            throw error;
        }
    }

    async addItemToCart(cartId, productId, quantity) {
        try {
            //console.log(cartId);
            const cart = await Cart.findById(cartId);
            //console.log(cart);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error;
        }
    }

    async removeItemFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId)
            if (!cart) throw new Error('Carrito no encontrado');

            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error.message);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.items = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error.message);
            throw error;
        }
    }

    async purchaseCart(cartId) {
        try {
            const { cid } = req.params;
            const cart = await Cart.findById(cartId)
            if (!cart) throw new Error('Carrito no encontrado');
            // Lógica para procesar la compra
            cart.items = [];
            await cart.save();
            return { message: 'Compra procesada exitosamente', cart };
        } catch (error) {
            console.error('Error al procesar la compra del carrito:', error.message);
            throw error;
        }
    }
}


