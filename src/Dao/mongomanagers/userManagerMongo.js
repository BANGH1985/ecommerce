import User from '../models/user.js'
import Cart from '../models/carts.model.js'
import passport from 'passport'

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.redirect('/register?error=El email ya está en uso.')
        }

        const newUser = new User({ username, email, password })
        await newUser.save()

        const newCart = new Cart()
        await newCart.save()
        newUser.cart = newCart._id
        await newUser.save()

        return res.redirect('/login?success=Usuario registrado correctamente. Por favor, inicie sesión.')
    } catch (error) {
        console.error('Error al registrar el usuario:', error)
        return res.redirect('/register?error=Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.')
    }
}

export const loginUser = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.redirect('/login?error=' + encodeURIComponent(info.message))
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/products')
        })
    })(req, res, next)
}

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err)
            return res.redirect('/?error=Error al cerrar sesión.')
        }
        res.redirect('/?success=Cierre de sesión exitoso.')
    })
}

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login?error=Necesitas iniciar sesión para acceder a esta página.')
    }
}