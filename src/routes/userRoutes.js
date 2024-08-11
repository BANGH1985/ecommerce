
import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser, getCurrentSession, isAuthenticated, sendPasswordResetEmail, resetPassword } from '../controllers/userController.js';

const router = express.Router();

// Ruta para servir la vista de forgot-password
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// Ruta para servir la vista de reset-password
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('reset-password', { token });
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/current', isAuthenticated, getCurrentSession);

router.post('/forgot-password', sendPasswordResetEmail);
router.post('/reset-password/:token', resetPassword);

router.get("/github", passport.authenticate("github", { scope: 'user:email' }), (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default router;
