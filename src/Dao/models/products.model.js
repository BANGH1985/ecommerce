import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "products"
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    },
    thumbnail: {
        type: String,
        required: false 
    },
    code: {
        type: String,
        unique: true, 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    }
})
productSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productCollection,productSchema)

export default productsModel