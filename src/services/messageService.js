import MessageManager from '../Dao/messageManagerMongo.js';

const messageManager = new MessageManager();

export default class MessageService {
    async getMessages() {
        return await messageManager.getMessages();
    }

    async createMessage(message) {
        return await messageManager.createMessage(message);
    }

    async deleteAllMessages() {
        return await messageManager.deleteAllMessages();
    }
}
