import messageModel from "../models/message.model.js";

export default class MessageManager {
    async getMessages() {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error al obtener mensajes:", error);
            return error;
        }
    }
    
    async createMessage(message) {
        if (message.user.trim() === '' || message.message.trim() === '') {
            console.warn("Intento de crear un mensaje vacío.");
            return null;
        }

        try {
            return await messageModel.create(message);
        } catch (error) {
            console.error("Error al crear mensaje:", error);
            return error;
        }
    }

    async deleteAllMessages() {
        try {
            console.log("Deleting all messages...");
            const result = await messageModel.deleteMany({});
            console.log("Messages deleted:", result);
            return result;
        } catch (error) {
            console.error("Error deleting messages:", error);
            return error;
        }
    }
}
