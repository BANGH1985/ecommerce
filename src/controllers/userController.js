import UserService from '../services/userService.js';
import passport from 'passport';
import { createHash } from '../utils.js';

const userService = new UserService();

export const registerUser = async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;  
    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.redirect('/register?error=El email ya está en uso.');
        }

        const newUser = await userService.createUser({ first_name, last_name, age, email, password: createHash(password) });
        const newCart = await userService.createCart();
        await userService.updateUserCart(newUser._id, newCart._id);

        return res.redirect('/login?success=Usuario registrado correctamente. Por favor, inicie sesión.');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.redirect('/register?error=Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.');
    }
};

export const loginUser = async (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?error=Usuario o contraseña incorrectos');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.user = user;
            return res.redirect('/api/sessions/current');
        });
    })(req, res, next);
};

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login?success=Sesión cerrada correctamente.');
    });
};

export const getCurrentSession = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render("current", { user: req.session.user });
    } else {
        return res.status(401).json({ message: 'No user is logged in' });
    }
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
