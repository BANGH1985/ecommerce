import mongoose from 'mongoose';

const userCollection = 'users';
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date
});

const User = mongoose.model(userCollection, userSchema);

export default User;
