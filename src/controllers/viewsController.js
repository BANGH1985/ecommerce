import ProductManager from '../Dao/productManagerMongo.js';
import CartManager from '../Dao/cartManagerMongo.js';
import MessageManager from '../Dao/messageManagerMongo.js';

const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

export default class ViewsController {
    async getProducts(req, res) {
        try {
            let { limit, page, sort, category } = req.query;
            const options = {
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                sort: { price: Number(sort) },
                lean: true
            };
            if (!(options.sort.price === -1 || options.sort.price === 1)) {
                delete options.sort;
            }
            const links = (products) => {
                let prevLink;
                let nextLink;
                if (req.originalUrl.includes('page')) {
                    prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                    nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                    return { prevLink, nextLink };
                }
                if (!req.originalUrl.includes('?')) {
                    prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
                    nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
                    return { prevLink, nextLink };
                }
                prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
                return { prevLink, nextLink };
            };

            const categories = await productManager.categories();
            const result = categories.some(categ => categ === category);

            if (result) {
                const products = await productManager.getProducts({ category }, options);
                const { prevLink, nextLink } = links(products);
                const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page: currentPage } = products;
                if (currentPage > totalPages) return res.render('notFound', { pageNotFound: '/products' });
                return res.render('products', { user: req.user, products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page: currentPage });
            }

            const products = await productManager.getProducts({}, options);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page: currentPage } = products;
            const { prevLink, nextLink } = links(products);

            if (currentPage > totalPages) return res.render('notFound', { pageNotFound: '/products' });

            return res.render('products', { user: req.user, products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page: currentPage });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos');
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productManager.getProductById(req.params.pid);
            if (product) {
                res.render('details', { user: req.user, product });
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (err) {
            res.status(500).send('Error al obtener el producto');
        }
    }

    async addProductToCart(req, res) {
        try {
            const { product, finishBuy } = req.body;
            if (product) {
                if (product.quantity > 0) {
                    const findId = cart.findIndex(productCart => productCart._id === product._id);
                    (findId !== -1) ? cart[findId].quantity += product.quantity : cart.push(product);
                } else {
                    return res.render('products', { message: 'Quantity must be greater than 0' });
                }
            }
            if (finishBuy) {
                await cartManager.addCart(cart);
                cart.splice(0, cart.length);
            }
            return res.render('products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al agregar el producto al carrito');
        }
    }

    getRealTimeProducts(req, res) {
        res.render("realtimeproducts", { user: req.user });
    }

    async getChat(req, res) {
        res.render("chat", { user: req.user });
    }

    async getLogin(req, res) {
        res.render('login');
    }

    async getRegister(req, res) {
        res.render('register');
    }

    async getCurrent(req, res) {
        res.render('current', { user: req.user });
    }
}
