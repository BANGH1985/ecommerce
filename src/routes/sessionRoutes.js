import { Router } from 'express';
import SessionController from '../controllers/sessionController.js';

const router = Router();
const sessionController = new SessionController();

// Ruta para renderizar el formulario de cambio de rol
router.get('/change-role', sessionController.renderChangeRole);

// Ruta para procesar el cambio de rol
router.post('/change-role/:uid', sessionController.changeRole);

export default router;
