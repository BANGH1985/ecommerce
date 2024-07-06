import mongoose from "mongoose"
const URI ="mongodb+srv://Dante:1985112aA.@cluster0.dr7thbm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
const connectToDB = () => {
    try {
            mongoose.connect(URI)
    } catch (error) {
        console.log(error)
    }
}

export default connectToDB