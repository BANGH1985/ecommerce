import ProductService from '../services/productService.js';

const productService = new ProductService();

export default class ProductController {
    async getProducts(req, res) {
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

            const products = await productService.getProducts(filter, options);

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
            res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { productId } = req.params;
            const product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found' });
            }
            res.status(200).json({ status: 'success', payload: product });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const product = req.body;
            const newProduct = await productService.addProduct(product);
            res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { productId } = req.params;
            const product = req.body;
            const updatedProduct = await productService.updateProduct(productId, product);
            res.status(200).json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { productId } = req.params;
            await productService.deleteProduct(productId);
            res.status(204).json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
        }
    }
}
