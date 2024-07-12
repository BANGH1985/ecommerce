import ProductService from '../services/productService.js';
import CartService from '../services/cartService.js';

const productService = new ProductService();
const cartService = new CartService();

export default class ViewsController {
    async getProducts(req, res) {
        try {
            const products = await productService.getProducts();
            res.render('products', { products });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error al obtener los productos');
        }
    }

    async getProductById(req, res) {
        const { pid } = req.params;
        try {
            const product = await productService.getProductById(pid);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.render('productDetail', { product });
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            res.status(500).send('Error al obtener el producto');
        }
    }

    async addProductToCart(req, res) {
        const { productId, quantity } = req.body;
        try {
            const cart = await cartService.getCartByUserId(req.user._id);
            await cartService.addProductToCart(cart._id, productId, quantity);
            res.redirect('/cart');
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
            res.status(500).send('Error al añadir producto al carrito');
        }
    }

    async getRealTimeProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.render('realtimeproducts', { products });
        } catch (error) {
            console.error('Error al obtener los productos en tiempo real:', error);
            res.status(500).send('Error al obtener los productos en tiempo real');
        }
    }

    async getChat(req, res) {
        try {
            res.render('chat');
        } catch (error) {
            console.error('Error al cargar la vista de chat:', error);
            res.status(500).send('Error al cargar la vista de chat');
        }
    }

    async getLogin(req, res) {
        try {
            res.render('login');
        } catch (error) {
            console.error('Error al cargar la vista de login:', error);
            res.status(500).send('Error al cargar la vista de login');
        }
    }

    async getRegister(req, res) {
        try {
            res.render('register');
        } catch (error) {
            console.error('Error al cargar la vista de registro:', error);
            res.status(500).send('Error al cargar la vista de registro');
        }
    }
}
