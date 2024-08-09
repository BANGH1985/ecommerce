// controllers/sessionController.js
import User from '../models/user.model.js';

export default class SessionController {
    async renderChangeRole(req, res) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.render('changeRole', { user });
        } catch (error) {
            console.error('Error al renderizar la vista de cambio de rol:', error);
            res.status(500).send('Error al renderizar la vista');
        }
    }

    async changeRole(req, res) {
        try {
            const { uid } = req.params;
            const { role } = req.body;
            const user = await User.findById(uid);

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            // Cambiar el rol del usuario
            if (role === 'premium') {
                user.role = 'premium';
            } else if (role === 'user') {
                user.role = 'user';
            }

            await user.save();
            res.redirect('/api/sessions/current');
        } catch (error) {
            console.error('Error al cambiar el rol del usuario:', error);
            res.status(500).send('Error al cambiar el rol');
        }
    }
}
