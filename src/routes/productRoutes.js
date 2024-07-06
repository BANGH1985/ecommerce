import { Router } from "express";
import ProductManager from "../Dao/mongomanagers/productManagerMongo.js";

const manager = new ProductManager();
const router = Router();

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

        const products = await manager.getProducts(filter, options);

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
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const productfind = await manager.getProductById(req.params.pid);
        res.status(200).json({ status: "success", productfind });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal Server Error", error: error.message });
    }
});

router.post("/products", async (req, res) => {
    try {
        const obj = req.body;
        const newproduct = await manager.addProduct(obj);
        res.status(201).json({ status: "success", newproduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal Server Error", error: error.message });
    }
});

router.put("/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const obj = req.body;
        const updatedproduct = await manager.updateProduct(pid, obj);
        res.status(200).json({ status: "success", updatedproduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal Server Error", error: error.message });
    }
});

router.delete("/products/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const deleteproduct = await manager.deleteProduct(id);
        res.status(200).json({ status: "success", deleteProduct: deleteproduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal Server Error", error: error.message });
    }
});

export default router;
