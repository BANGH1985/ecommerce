import { Router } from 'express';
import ProductManager from '../controllers/productController.js';

const router = Router();
const productController = new ProductManager();

router.get('/products', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query, availability } = req.query;
        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        let filter = {};
        if (query) {
            filter.category = query;
        }
        if (availability) {
            filter.status = availability === 'available' ? true : false;
        }

        const products = await productController.getProducts(filter, options);

        res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage
        });
    } catch (error) {
        //console.log(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.pid);
        res.status(200).json({ status: 'success', product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const newProduct = await productController.addProduct(req.body);
        res.status(201).json({ status: 'success', newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

router.put('/products/:pid', async (req, res) => {
    try {
        const updatedProduct = await productController.updateProduct(req.params.pid, req.body);
        res.status(200).json({ status: 'success', updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

router.delete('/products/:pid', async (req, res) => {
    try {
        const deleteProduct = await productController.deleteProduct(req.params.pid);
        res.status(200).json({ status: 'success', deleteProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

export default router;
