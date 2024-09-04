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
    passport.authenticate('login', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?error=Usuario o contraseña incorrectos');
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            await userService.updateLastConnection(user._id);
            req.session.user = user;
            return res.redirect('/api/sessions/current');
        });
    })(req, res, next);
};

export const logoutUser = async (req, res, next) => {
    if (req.user) {
        try {
            await userService.updateLastConnection(req.user._id);
        } catch (error) {
            console.error('Error al actualizar la última conexión:', error);
        }
    }
    
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login?success=Sesión cerrada correctamente.');
    });
};

export const uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await userService.findUserById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const documents = req.files.map(file => ({
            name: file.fieldname,
            reference: `/uploads/${file.fieldname === 'profile' ? 'profiles' : 'documents'}/${file.filename}`
        }));

        await userService.addUserDocuments(uid, documents);
        return res.json({ message: 'Documentos subidos correctamente' });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        return res.status(500).json({ error: 'Error al subir documentos' });
    }
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
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,  
            },
        });

        const resetUrl = `http://localhost:8080/api/sessions/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER, 
            subject: 'Recuperación de contraseña',
            text: `Por favor, haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
        };
        transporter.sendMail(mailOptions);
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
        res.send(`<script>alert('Contraseña restablecida correctamente'); window.location.href='/login';</script>`);
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).send(`<script>alert('Error interno del servidor'); window.location.href='/login';</script>`);
    }
};


export const renderChangeRole = async (req, res) => {
    try {
        const user = await userService.findUserById(req.user._id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        
        const isPremium = user.role === 'premium';
        res.render('changeRole', { user, isPremium });
    } catch (error) {
        console.error('Error al renderizar la vista de cambio de rol:', error);
        res.status(500).send('Error al renderizar la vista');
    }
};

export const changeRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        const user = await userService.findUserById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (role === 'premium') {
            const hasEnoughDocuments = user.documents && user.documents.length >= 3;

            if (!hasEnoughDocuments) {
                return res.status(400).json({ error: 'El usuario no ha terminado de cargar la documentación requerida.' });
            }

            user.role = 'premium';
        } else if (role === 'user') {
            user.role = 'user';
        }

        await userService.updateUserRole(user);
        if (req.session.user._id.toString() === uid.toString()) {
            req.session.user.role = user.role;
        }
        return res.redirect('/api/sessions/current');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        return res.status(500).json({ error: 'Error al cambiar el rol' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('adminUsers', { users }); // Renderiza una vista donde se mostrarán los usuarios
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await userService.findUserById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Cuenta eliminada',
            text: 'Tu cuenta ha sido eliminada por un administrador.',
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error al enviar el correo de eliminación de cuenta:', error);
                return res.status(500).json({ error: 'Error al enviar el correo electrónico' });
            } else {
                console.log('Correo enviado:', info.response);

                // Después de enviar el correo, eliminar el usuario
                await userService.deleteUser(uid);

                // Redirigir después de la eliminación exitosa
                return res.redirect('/api/sessions/admin/users');
            }
        });

    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};









