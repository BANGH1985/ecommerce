import UserService from '../services/userService.js';
import passport from 'passport';
import { createHash } from '../utils.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
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

export const sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(400).send(`<script>alert('No existe un usuario con ese email'); window.location.href='/login';</script>`);
        }

        const token = await userService.generatePasswordResetToken(user._id);
        
        // Configurar y enviar el correo electrónico
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Usar la variable de entorno correcta
                pass: process.env.EMAIL_PASS,  // Usar la variable de entorno correcta
            },
        });

        const resetUrl = `http://localhost:8080/api/sessions/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER, // Usar la variable de entorno correcta
            subject: 'Recuperación de contraseña',
            text: `Por favor, haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
        };
        transporter.sendMail(mailOptions);
        
        // Respuesta con alerta y redirección
        res.send(`<script>alert('Se ha enviado un correo electrónico para restablecer la contraseña'); window.location.href='/login';</script>`);
    } catch (error) {
        console.error('Error al enviar el correo de recuperación:', error);
        res.status(500).send(`<script>alert('Error interno del servidor'); window.location.href='/login';</script>`);
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await userService.findUserByResetToken(token);
        if (!user) {
            return res.status(400).send(`<script>alert('Token inválido o expirado'); window.location.href='/login';</script>`);
        }

        await userService.updatePassword(user._id, password);
        
        // Respuesta con alerta y redirección
        res.send(`<script>alert('Contraseña restablecida correctamente'); window.location.href='/login';</script>`);
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).send(`<script>alert('Error interno del servidor'); window.location.href='/login';</script>`);
    }
};

