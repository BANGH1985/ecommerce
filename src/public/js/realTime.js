const socketClient=io()

socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(productList) {

    const productsDiv  = document.getElementById('list-products')

    let productosHTML = ""
  
    productList.forEach((product) => {
        productosHTML += 
        `<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
          <div class="card-header bg-primary text-white">code: ${product.code}</div>
            <div class="card-body">
                <h4 class="card-title text-white">${product.title}</h4>
                <p class="card-text">
                <ul class="card-text">
                <li>id: ${product._id}</li>
                <li>description: ${product.description}</li>
                <li>price: $${product.price}</li>
                <li>category: ${product.category}</li>
                <li>status: ${product.status}</li>
                <li>stock: ${product.stock}</li>
                thumbnail: <img src="${product.thumbnail}" alt="img" class="img-thumbnail img-fluid">        </ul>
                </p>
            </div>
            <div class="d-flex justify-content-center mb-4">
            <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct('${product._id}')">Eliminar</button>

            </div>
          </div>
        </div>`
    })
  
    productsDiv .innerHTML = productosHTML
  }


  let form = document.getElementById("formProduct");
    form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        
        const title = form.elements.title.value;
        const description = form.elements.description.value;
        const stock = form.elements.stock.value;
        const thumbnail = form.elements.thumbnail.value;
        const category = form.elements.category.value;
        const price = form.elements.price.value;
        const code = form.elements.code.value;
        const status = form.elements.status.checked;

        const product = {
            title,
            description,
            stock,
            thumbnail,
            category,
            price,
            code,
            status,
        };

        console.log("Producto a enviar:", product); // Log para verificar que el producto se está creando correctamente

        socketClient.emit("addProduct", { user, product });

        form.reset();
    });

  document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = parseInt(deleteidinput.value);
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
});

function deleteProduct(_id) {
  socketClient.emit("deleteProduct", { user, id: _id });
}
