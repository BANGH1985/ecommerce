import mongoose from 'mongoose';

// Nombre de la colección en la base de datos
const collectionName = "messages";

// Definición del esquema para los mensajes
const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
}, { timestamps: true }); // Añadir timestamps para registrar la fecha y hora de creación y actualización

// Crear el modelo de mensaje utilizando el esquema definido
const messageModel = mongoose.model(collectionName, messageSchema);

// Exportar el modelo para su uso en otras partes del proyecto
export default messageModel;
