import productsModel from "../models/products.model.js";

export default class ProductManager {
    async categories() {
        try {
            const categories = await productsModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ]);
            return categories[0].categories;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getProductsView() {
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const { page = 1, limit = 3, sort, lean = true } = options;
            const queryOptions = {
                page,
                limit,
                sort,
                lean
            };
            return await productsModel.paginate(filter, queryOptions);
        } catch (err) {
            return err;
        }
    }

    async getProductById(id) {
        try {
            const product = await productsModel.findById(id).lean();
            return product;
        } catch (err) {
            console.error('Error al obtener el producto por ID:', err.message);
            return null;
        }
    };

    async addProduct(product) {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title }).lean();
        } catch (err) {
            return err;
        }
    }

    async updateProduct(id, product) {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product }, { new: true }).lean();
        } catch (err) {
            return err;
        }
    }

    async deleteProduct(_id) {
        try {
            return await productsModel.findByIdAndDelete(_id).lean();
        } catch (err) {
            return err;
        }
    }
}
