async function removeFromCart(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Swal.fire({
                title: 'Producto eliminado',
                text: 'El producto ha sido eliminado del carrito',
                icon: 'success',
            }).then(() => {
                location.reload(); 
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al eliminar el producto del carrito',
                icon: 'error',
            });
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al eliminar el producto del carrito',
            icon: 'error',
        });
    }
}

async function emptyCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Swal.fire({
                title: 'Carrito vaciado',
                text: 'Todos los productos han sido eliminados del carrito',
                icon: 'success',
            }).then(() => {
                location.reload(); 
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al vaciar el carrito',
                icon: 'error',
            });
        }
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al vaciar el carrito',
            icon: 'error',
        });
    }
}
