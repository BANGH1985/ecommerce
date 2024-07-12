import ProductManager from '../Dao/productManagerMongo.js';

const productManager = new ProductManager();

export default class ProductService {
    async getProducts(filter, options) {
        return await productManager.getProducts(filter, options);
    }

    async getProductById(productId) {
        return await productManager.getProductById(productId);
    }

    async addProduct(product) {
        return await productManager.addProduct(product);
    }

    async updateProduct(productId, product) {
        return await productManager.updateProduct(productId, product);
    }

    async deleteProduct(productId) {
        return await productManager.deleteProduct(productId);
    }
}
