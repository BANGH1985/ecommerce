import UserManager from '../Dao/userManagerMongo.js';

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
}
