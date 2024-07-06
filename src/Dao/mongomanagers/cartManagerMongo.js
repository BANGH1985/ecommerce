import mongoose from "mongoose";
import CartModel from "../models/carts.model.js";

export default class CartManager {
    getCarts = async () => {
        try {
            const carts = await CartModel.find().populate('items.productId').lean();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };

    getCartById = async (id) => {
        try {
            const cart = await CartModel.findById(id).populate('items.productId').lean();
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return null;
        }
    }

    addCart = async (userId, items) => {
        try {
            const cart = await CartModel.create({ user: userId, items });
            return cart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            return null;
        }
    }

    addProductToCart = async (cid, productId, quantity) => {
        try {
            // Verificar que cid y productId son válidos ObjectIds
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new Error('ID de carrito no válido');
            }
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID de producto no válido');
            }

            // Buscar el carrito
            const cart = await CartModel.findById(cid);

            if (!cart) {
                console.error('Carrito no encontrado');
                return null;
            }

            // Buscar el producto en el carrito
            const productInCart = cart.items.find(item => item.productId.toString() === productId);

            if (productInCart) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                productInCart.quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.items.push({ productId, quantity });
            }

            // Guardar el carrito actualizado
            await cart.save();

            // Población del carrito
            const updatedCart = await CartModel.findById(cid).populate('items.productId');
            return updatedCart;
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err.message);
            return null;
        }
    }

    deleteProductInCart = async (cid, pid) => {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                return null;
            }

            cart.items = cart.items.filter(item => item.productId.toString() !== pid);

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err.message);
            return null;
        }
    }

    updateCart = async (cartId, items) => {
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { items }, { new: true }).populate('items.productId');
            return cart;
        } catch (err) {
            console.error('Error al actualizar el carrito:', err.message);
            return null;
        }
    }

    updateOneProduct = async (cid, product) => {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cid, "items._id": product._id },
                { $set: { "items.$.quantity": product.quantity } },
                { new: true }
            );
            return cart;
        } catch (err) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', err.message);
            return null;
        }
    }

    deleteAllProductsInCart = async (cid) => {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                return null;
            }

            cart.items = [];

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al eliminar todos los productos del carrito:', err.message);
            return null;
        }
    }
}
