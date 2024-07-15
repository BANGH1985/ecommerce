import CartService from '../services/cartService.js';

const cartService = new CartService();

export default class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.user.cart._id;
            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.render('cart', { cart });
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }

    async purchaseCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send('Carrito no encontrado');
            }

            const amount = cart.products.reduce((total, product) => total + (product.price * product.quantity), 0);
            const ticket = new Ticket({
                amount,
                purchaser: req.user.email
            });

            await ticket.save();

            // Enviar email con el comprobante de compra
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dantesoriano30@gmail.com',
                    pass: 'hhgu inyr vrgq mokv'
                }
            });

            const mailOptions = {
                from: 'dantesoriano30@gmail.com',
                to: req.user.email,
                subject: 'Comprobante de compra',
                text: `Gracias por tu compra. El código de tu ticket es: ${ticket.code}`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).send('Compra finalizada y comprobante enviado por email');
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            res.status(500).send('Error al finalizar la compra');
        }
    }

    async addItemToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartService.addItemToCart(cid, pid, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error al agregar el artículo al carrito:', error);
            res.status(500).json({ error: 'Error al agregar el artículo al carrito' });
        }
    }

    async removeItemFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartService.removeItemFromCart(cid, pid);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error al eliminar el artículo del carrito:', error);
            res.status(500).json({ error: 'Error al eliminar el artículo del carrito' });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const clearedCart = await cartService.clearCart(cid);
            res.status(200).json(clearedCart);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cartId } = req.params;
            const purchaseResult = await cartService.purchaseCart(cartId);
            res.render('purchase', { ticket: purchaseResult.ticket });
        } catch (error) {
            console.error('Error al realizar la compra del carrito:', error);
            res.status(500).json({ error: 'Error al realizar la compra del carrito' });
        }
    }
}
