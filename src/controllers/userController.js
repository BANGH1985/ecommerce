import passport from 'passport';
import User from '../models/user.js';
import Cart from '../models/carts.model.js';

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;  
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/register?error=El email ya está en uso.');
        }

        const newUser = new User({ first_name, last_name, email, password });  
        await newUser.save();

        const newCart = new Cart();
        await newCart.save();
        newUser.cart = newCart._id;
        await newUser.save();

        return res.redirect('/login?success=Usuario registrado correctamente. Por favor, inicie sesión.');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.redirect('/register?error=Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.');
    }
};

export const loginUser = (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?error=' + encodeURIComponent(info.message));
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            const userObj = user.toObject();
            req.session.user = userObj;
            console.log('Usuario autenticado:', user);
            return res.redirect('/');
        });
    })(req, res, next);
};

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/?error=Error al cerrar sesión.');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.redirect('/?error=Error al cerrar sesión.');
            }
            res.clearCookie('connect.sid'); 
            res.redirect('/');
        });
    });
};

export const getCurrentSession = (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user })
    } else {
        res.status(401).json({ error: 'Usuario no autenticado' });
    }
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login?error=Necesitas iniciar sesión para acceder a esta página.');
    }
};
