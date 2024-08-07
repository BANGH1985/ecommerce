import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils.js'
import userService from '../models/user.model.js'
import cartService from '../models/carts.model.js'
import User from '../models/user.model.js';
import GitHubStrategy from 'passport-github2'


const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: 'El email ya está en uso' });
            }
            const hashedPassword = createHash(password); 
            const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
            await newUser.save();
    
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23li4OUCIT2M6fSVgF",
        clientSecret: "c36b2e36ccea716f1804811bfd3fa524397a069c",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email });
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    age: 0, // O cualquier valor predeterminado si no está disponible
                    password: ""
                };
                let createdUser = await userService.create(newUser);
                // Crear carrito después de que el usuario ha sido creado
                let newCart = await cartService.create({ items: [], user: createdUser._id });
                createdUser.cart = newCart._id;
                await createdUser.save();
                done(null, createdUser);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
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
