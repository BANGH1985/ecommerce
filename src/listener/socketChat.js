import MessageManager from "../Dao/mongomanagers/messageManagerMongo.js";
const mm = new MessageManager();

const socketChat = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log("Usuario conectado con id: " + socket.id);

        // Enviar todos los mensajes guardados al nuevo usuario cuando se conecta
        socket.on("nuevousuario", async (usuario) => {
            socket.broadcast.emit("broadcast", usuario);

            try {
                const messages = await mm.getMessages();
                socket.emit("chat", messages); // Emitir mensajes solo al nuevo usuario
            } catch (error) {
                console.error("Error al obtener mensajes:", error);
            }
        });

        // Manejar el envío de nuevos mensajes
        socket.on("mensaje", async (info) => {
            await mm.createMessage(info);
            const messages = await mm.getMessages();
            socketServer.emit("chat", messages); // Emitir mensajes a todos los clientes
        });

        // Manejar la limpieza del chat
        socket.on("clearchat", async () => {
            try {
                await mm.deleteAllMessages();
                const messages = await mm.getMessages(); // Debería estar vacío después de borrar
                socketServer.emit("chat", messages); // Emitir mensajes a todos los clientes
            } catch (error) {
                console.error("Error al borrar mensajes:", error);
            }
        });
    });
};

export default socketChat;
