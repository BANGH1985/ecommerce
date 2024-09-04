import express from 'express';
import passport from 'passport';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentSession, 
    isAuthenticated, 
    sendPasswordResetEmail, 
    resetPassword, 
    renderChangeRole, 
    changeRole, 
    uploadDocuments,
    getAllUsers, 
    deleteUser 
} from '../controllers/userController.js';
import { uploadDocument } from '../middleware/upload.js';
import { isAdmin } from '../middleware/auth.js'; 

const router = express.Router();

// Rutas de autenticación y gestión de usuarios
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/current', isAuthenticated, getCurrentSession);
router.post('/forgot-password', sendPasswordResetEmail);
router.post('/reset-password/:token', resetPassword);

// Rutas de cambio de rol y carga de documentos
router.get('/change-role', isAuthenticated, renderChangeRole);
router.post('/change-role/:uid', isAuthenticated, changeRole);
router.post('/:uid/documents', isAuthenticated, uploadDocument.array('documents'), uploadDocuments);

// Rutas de administración
router.get('/admin/users', isAuthenticated, isAdmin, getAllUsers); 
router.post('/admin/users/:uid', isAuthenticated, isAdmin, deleteUser); 

// Rutas de autenticación con GitHub
router.get("/github", passport.authenticate("github", { scope: 'user:email' }));
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default router;
