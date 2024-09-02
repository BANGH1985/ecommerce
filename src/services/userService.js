import UserManager from '../Dao/userManagerMongo.js';
import { createHash } from '../utils.js';
import crypto from 'crypto';

const userManager = new UserManager();

export default class UserService {
    async findUserByEmail(email) {
        return await userManager.findUserByEmail(email);
    }
    async createUser(userData) {
        return await userManager.createUser(userData);
    }
    async createCart() {
        return await userManager.createCart();
    }
    async updateUserCart(userId, cartId) {
        return await userManager.updateUserCart(userId, cartId);
    }
    async generatePasswordResetToken(userId) {
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hora
        await userManager.savePasswordResetToken(userId, token, expires);
        return token;
    }

    async updateLastConnection(userId) {
        try {
            return await userManager.updateLastConnection(userId);
        } catch (error) {
            console.error('Error al actualizar la última conexión:', error);
            throw error;
        }
    }
    async addUserDocuments(userId, documents) {
        return await userManager.addUserDocuments(userId, documents);
    }
    async findUserByResetToken(token) {
        return await userManager.findUserByResetToken(token);
    }
    async updatePassword(userId, newPassword) {
        const hashedPassword = createHash(newPassword);
        return await userManager.updatePassword(userId, hashedPassword);
    }
    async findUserById(userId) {
        return await userManager.findUserById(userId);
    }
    async updateUserRole(user) {
        return await userManager.updateUserRole(user);
    }
}
