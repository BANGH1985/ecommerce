import productsModel from "../models/products.model.js";

export default class ProductManager {
    categories = async () => {
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

    getProductsView = async () => {
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err;
        }
    }

    getProducts = async (filter = {}, options = {}) => {
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

    getProductById = async (id) => {
        try {
            const product = await productsModel.findById(id).lean();
            return product;
        } catch (err) {
            console.error('Error al obtener el producto por ID:', err.message);
            return null;
        }
    };

    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title }).lean();
        } catch (err) {
            return err
        }
    }

    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product }, { new: true }).lean();
        } catch (err) {
            return err;
        }
    }

    deleteProduct = async (_id) => {
        try {
            return await productsModel.findByIdAndDelete(_id).lean();
        } catch (err) {
            return err;
        }
    }
}
