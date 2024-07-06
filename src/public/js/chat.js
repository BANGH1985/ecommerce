const socketClient = io();
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const inputmensaje = document.getElementById("mensaje");
const chatMessages = document.getElementById("chat-messages");
const clearChatButton = document.getElementById("clear-chat");

let usuario = null;

if (!usuario) {
    Swal.fire({
        title: "Bienvenidos al Chat",
        text: "Ingresa tu usuario",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "Necesitas ingresar tu Nombre";
            }
        }
    }).then((username) => {
        usuario = username.value;
        nombreUsuario.innerHTML = usuario;
        socketClient.emit("nuevousuario", usuario);
    }).catch((error) => {
        console.error("Error al ingresar usuario:", error);
    });
}

formulario.onsubmit = (e) => {
    e.preventDefault();
    if (inputmensaje.value.trim() === "") return;

    const info = {
        user: usuario,
        message: inputmensaje.value
    };

    socketClient.emit("mensaje", info);
    inputmensaje.value = ""; // Limpiar el input después de enviar
};

clearChatButton.onclick = () => {
    socketClient.emit("clearchat");
};

socketClient.on("chat", (mensajes) => {
    const chatRender = mensajes.map(e => {
        return `<div class="message"><strong>${e.user}:</strong> ${e.message}</div>`;
    }).join("");
    chatMessages.innerHTML = chatRender;
});

socketClient.on("broadcast", (usuario) => {
    Toastify({
        text: `Ingreso ${usuario} al chat`,
        duration: 5000,
        position: 'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
});
