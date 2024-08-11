import ProductManager from "../Dao/productManagerMongo.js";
const pm = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on("connection",async(socket)=>{
        console.log("client connected con ID:",socket.id)
        const listadeproductos=await pm.getProductsView()
        socketServer.emit("enviodeproducts",listadeproductos)
        socket.on("addProduct", async (obj) => {
            const { user, product } = obj;
            if (user && product) { 
                await pm.addProduct(product, user); 
                const listadeproductos = await pm.getProductsView();
                socketServer.emit("enviodeproducts", listadeproductos);
            } else {
                console.error("Faltan datos de usuario o producto");
            }
        });
        socket.on("deleteProduct", async (data) => {
            const { user, id } = data; 
        
            const product = await pm.getProductById(id);
            if (product) {
                if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
                    await pm.deleteProduct(id);
                    const listadeproductos = await pm.getProductsView();
                    socketServer.emit("enviodeproducts", listadeproductos);
                } else {
                    console.error("No tienes permiso para eliminar este producto.");
                }
            } else {
                console.error("Producto no encontrado.");
            }
        });
        socket.on("nuevousuario",(usuario)=>{
            console.log("usuario" ,usuario)
            socket.broadcast.emit("broadcast",usuario)
            })
            socket.on("disconnect",()=>{
                console.log(`Usuario con ID : ${socket.id} esta desconectado `)
            })
    })
};

export default socketProducts;