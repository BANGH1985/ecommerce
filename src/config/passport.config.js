import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

const initializePassport = () => {
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email }).populate('cart');
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            const isMatch = isValidPassword(user, password);
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).populate('cart');
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default initializePassport;
