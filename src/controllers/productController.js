import ProductManager from '../Dao/productManagerMongo.js';

const productManager = new ProductManager();

export default class ProductController {
    async getProducts(filter, options) {
        try {
            return await productManager.getProducts(filter, options);
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productManager.getProductById(id);
        } catch (error) {
            throw error;
        }
    }

    async addProduct(product) {
        try {
            return await productManager.addProduct(product);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, product) {
        try {
            return await productManager.updateProduct(id, product);
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await productManager.deleteProduct(id);
        } catch (error) {
            throw error;
        }
    }
}
