import User from '../models/user.model.js';
import Cart from '../models/carts.model.js';

export default class UserManager {
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email }).lean(); // Utilizando lean() para convertir a objeto plano
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser.toObject(); // Convertir a objeto plano
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return newCart.toObject(); // Convertir a objeto plano
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async updateUserCart(userId, cartId) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, { cart: cartId }, { new: true });
            return updatedUser.toObject(); // Convertir a objeto plano
        } catch (error) {
            console.error('Error al actualizar carrito del usuario:', error);
            throw error;
        }
    }
    async savePasswordResetToken(userId, token, expires) {
        try {
            await User.findByIdAndUpdate(userId, {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            });
        } catch (error) {
            console.error('Error al guardar el token de recuperación:', error);
            throw error;
        }
    }

    async findUserByResetToken(token) {
        try {
            return await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            }).lean();
        } catch (error) {
            console.error('Error al buscar usuario por token de recuperación:', error);
            throw error;
        }
    }

    async updatePassword(userId, hashedPassword) {
        try {
            return await User.findByIdAndUpdate(userId, {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            });
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            throw error;
        }
    }

}
