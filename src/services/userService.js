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
