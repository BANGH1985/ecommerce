import { Router } from 'express';
import CartManager from "../Dao/mongomanagers/cartManagerMongo.js";
import ProductManager from '../Dao/mongomanagers/productManagerMongo.js';
import cartModel from '../Dao/models/carts.model.js';
import mongoose from 'mongoose';

const router = Router();
const manager = new CartManager();
const pm = new ProductManager();

const getPopulatedCart = async (cartId) => {
    try {
        const cart = await cartModel.findById(cartId).populate('items.productId').lean();
        return cart;
    } catch (error) {
        throw new Error('Error al obtener el carrito');
    }
};
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await getPopulatedCart(cartId);
        res.render('cart', {
            user: req.session.user,
            cart
        });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).render('cart', { error: error.message });
    }
});
router.post('/:cid', async (req, res) => {
    try {
        const userCart = req.params.cid;
        const { productId, quantity } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userCart)) {
            return res.status(400).send({ status: "error", error: "Carrito ID no válido" });
        }
        let cart = await manager.addProductToCart(userCart, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({ status: "error", error: "ID de carrito o producto no válido" });
        }
        const cart = await manager.deleteProductInCart(cid, pid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!mongoose.Types.ObjectId.isValid(req.params.cid) || !mongoose.Types.ObjectId.isValid(req.params.pid)) {
            return res.status(400).send({ status: "error", error: "ID de carrito o producto no válido" });
        }
        const cart = await manager.updateOneProduct(req.params.cid, { _id: req.params.pid, quantity });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Cantidad del producto actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.cid)) {
            return res.status(400).send({ status: "error", error: "Carrito ID no válido" });
        }

        const cart = await manager.deleteAllProductsInCart(req.params.cid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
});

export default router;
