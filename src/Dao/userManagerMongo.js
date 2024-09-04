import User from '../models/user.model.js';
import Cart from '../models/carts.model.js';

export default class UserManager {
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email }).lean(); 
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser.toObject(); 
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return newCart.toObject(); 
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async updateUserCart(userId, cartId) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, { cart: cartId }, { new: true });
            return updatedUser.toObject(); 
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

    async updateLastConnection(userId) {
        try {
            return await User.findByIdAndUpdate(userId, { last_connection: new Date() }, { new: true });
        } catch (error) {
            console.error('Error al actualizar la última conexión del usuario:', error);
            throw error;
        }
    }

    async addUserDocuments(userId, documents) {
        try {
            return await User.findByIdAndUpdate(
                userId,
                { $push: { documents: { $each: documents } } },
                { new: true }
            );
        } catch (error) {
            console.error('Error al agregar documentos al usuario:', error);
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

    async findUserById(userId) {
        try {
            return await User.findById(userId).lean(); 
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    }

    async updateUserRole(user) {
        try {
            return await User.findByIdAndUpdate(user._id, { role: user.role }, { new: true });
        } catch (error) {
            console.error('Error al actualizar el rol del usuario:', error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            return await User.find().lean();
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }
    
    async deleteUser(userId) {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }
}