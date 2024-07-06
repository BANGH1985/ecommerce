let cartId; // Variable global para almacenar el ID del carrito

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

        const data = await response.json();
        if (data.user && data.user.cart) {
            cartId = data.user.cart; // Inicializar `cartId` con el valor del carrito en la sesión
        } else {
            console.error('Carrito no encontrado en la sesión del usuario');
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

    const response = await fetch(url);
    const data = await response.json();

    products = data.payload;
    renderProducts(products);
    renderPagination(data);
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
                                </i><img src="${product.thumbnail}" alt="${product.title}" class="img-fluid mt-2">
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
        button.addEventListener('click', addToCart);
    });
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevPage = data.hasPrevPage ? `<a href="#" onclick="fetchProducts(${data.prevPage}); return false;" class="btn btn-primary">Prev Page</a>` : `<span class="btn btn-secondary disabled">Prev Page</span>`;
    const nextPage = data.hasNextPage ? `<a href="#" onclick="fetchProducts(${data.nextPage}); return false;" class="btn btn-primary">Next Page</a>` : `<span class="btn btn-secondary disabled">Next Page</span>`;
    
    pagination.innerHTML = `
        ${prevPage}
        <span>Page ${data.page} of ${data.totalPages}</span>
        ${nextPage}
    `;
}

async function addToCart(event) {
    const productId = event.target.id;
    const stock = Number(event.target.getAttribute('data-value'));
    const { value: quantity } = await Swal.fire({
        title: 'Add quantity',
        input: 'number',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirm',
    });

    if (quantity !== null) {
        const quantityNumber = Number(quantity);
        if (quantityNumber > 0 && stock >= quantityNumber) {
            try {
                const response = await fetch(`/api/carts/${cartId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "productId": productId, "quantity": quantityNumber }),
                });
                if (response.ok) {
                    Swal.fire({
                        title: 'Product added successfully',
                        text: `ID: ${productId} - Quantity: ${quantityNumber}`,
                        icon: 'success',
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'There was an error adding the product to the cart',
                        icon: 'error',
                    });
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error adding the product to the cart',
                    icon: 'error',
                });
            }
        } else if (quantityNumber <= 0) {
            Swal.fire({
                title: 'Quantity must be greater than 0',
                icon: 'warning',
            });
        } else {
            Swal.fire({
                title: 'Quantity cannot be greater than stock',
                icon: 'error',
            });
        }
    }
}

function showProductDetails(productId) {
    const product = products.find(product => product._id === productId);
    if (product) {
        displayProductDetailsModal(product);
    } else {
        console.error("Producto no encontrado en la lista de productos recibidos");
    }
}

function displayProductDetailsModal(product) {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = product.title;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>ID:</strong> ${product._id}</p>
        <p><strong>Categoria:</strong> ${product.category}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid">
    `;

    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();

    // Cerrar el modal cuando el botón de cerrar es presionado
    document.querySelector('.btn-close').addEventListener('click', () => {
        productModal.hide();
    });

    // Asegurarse de que el modal se oculta correctamente
    productModal._element.addEventListener('hidden.bs.modal', () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    });
}
