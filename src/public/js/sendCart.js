let cartId

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar si el usuario está en sesión y tiene un carrito asignado
        const response = await fetch('/api/sessions/current', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.user && data.user.cart) {
                cartId = data.user.cart; // Asignar `cartId` con el valor del carrito en la sesión del usuario
            } else {
                console.error('Carrito no encontrado en la sesión del usuario');
            }
        } else {
            console.error('Error al obtener el carrito de la sesión del usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error al obtener el carrito de la sesión del usuario:', error);
    }

    fetchProducts();
});

document.getElementById('filterForm').addEventListener('change', function() {
    fetchProducts();
});

async function fetchProducts(page = 1) {
    const query = document.getElementById('query').value;
    const availability = document.getElementById('availability').value;
    const sort = document.getElementById('sort').value;
    
    const limit = 6;

    const url = new URL('/api/products', window.location.origin);
    url.searchParams.set('query', query);
    url.searchParams.set('availability', availability);
    url.searchParams.set('sort', sort);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const data = await response.json();
        renderProducts(data.payload);
        renderPagination(data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="col mb-4">
                <div class="card h-100 bg-light">
                    <div class="card-header bg-primary text-white">
                        <i class="bi bi-tag"></i> Code: ${product.code}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-dark" id="title">${product.title}</h5>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-currency-dollar"></i> Price: $${product.price}</li>
                            <li><i class="bi bi-check-circle"></i> Status: ${product.status}</li>
                            <li>
                                <img src="${product.thumbnail || 'default-image.jpg'}" alt="${product.title}" class="img-fluid mt-2">
                            </li>
                        </ul>
                        <div class="text-center mt-3">
                            <a id="${product._id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal" onclick="showProductDetails('${product._id}')">Ver Detalles</a>
                            <button class="btn btn-success text-lg product" data-value="${product.stock}" id="${product._id}">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });

    document.querySelectorAll('.product').forEach(button => {
        button.addEventListener('click', () => {
            //const cartId = "669076eae95c0ff7cd6d8856"
            const cartElement = document.querySelector("#cartid");
            const cartId = cartElement.getAttribute("data-value");
            if (cartId) {
                addToCart(cartId, button.id, 1); // Pasar los parámetros correctos a `addToCart`
            } else {
                Swal.fire('Error', 'Carrito no encontrado', 'error');
            }
        });
    });
}

async function addToCart(cartId, productId, quantity) {
    try {
        //console.log("Cart ID:", cartId); // Agregar estos logs para verificar los valores
        //console.log("Product ID:", productId);

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        Swal.fire('Producto añadido', 'El producto ha sido añadido al carrito', 'success');
    } catch (error) {
        console.error('Error al añadir el producto al carrito:', error);
        Swal.fire('Error', 'No se pudo añadir el producto al carrito', 'error');
    }
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevPage = data.hasPrevPage ? `<a href="#" onclick="fetchProducts(${data.prevPage}); return false;" class="btn btn-primary">Prev Page</a>` : `<span class="btn btn-secondary disabled">Prev Page</span>`;
    const nextPage = data.hasNextPage ? `<a href="#" onclick="fetchProducts(${data.nextPage}); return false;" class="btn btn-primary">Next Page</a>` : `<span class="btn btn-secondary disabled">Next Page</span>`;

    pagination.innerHTML = `${prevPage} ${nextPage}`;
}
