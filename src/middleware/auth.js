export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Acceso denegado. Solo los administradores pueden realizar esta acción.');
    }
};

export const isPremium = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'premium') {
        return next();
    } else {
        res.status(403).send('Acceso denegado. Solo los usuarios premium pueden realizar esta acción.');
    }
};
export const isOwnerOrAdmin = (req, res, next) => {
    const { productId } = req.params;
    const user = req.session.user;

    if (user.role === 'admin') {
        return next();
    }

    // Asegúrate de tener acceso al servicio o gestor de productos en este archivo o pásalo desde el controller
    productService.getProductById(productId).then((product) => {
        if (product.owner === user.email || user.role === 'admin') {
            return next();
        } else {
            res.status(403).send('Acceso denegado. Solo el propietario o un administrador pueden realizar esta acción.');
        }
    }).catch((error) => {
        console.error('Error al verificar el propietario del producto:', error);
        res.status(500).send('Error interno del servidor');
    });
};
export const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        res.status(403).send('Acceso denegado. Solo los usuarios pueden realizar esta acción.');
    }
};
