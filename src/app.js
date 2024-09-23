import express from 'express';
import path from 'path'
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import userRoutes from './routes/userRoutes.js';

import initializePassport from './config/passport.config.js';
import connectToDB from './config/configServer.js';

import socketProducts from './listener/socketProducts.js';
import socketChat from './listener/socketChat.js';

dotenv.config();
connectToDB();

const app = express();
const PORT = 8080;

// Cargar los archivos YAML
const productDocumentation = YAML.load('./docs/products.yaml');
const cartDocumentation = YAML.load('./docs/carts.yaml');
const userDocumentation = YAML.load('./docs/users.yaml');

app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

// Middleware para pasar la información del usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


// Configuración de Express para renderizar vistas con handlebars
app.engine('handlebars', engine({   
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        },
        eq: function(a, b) {
            return a === b;
        },
        or: function(v1, v2, options) {
            return v1 || v2;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/views'));

// Rutas
app.use('/', viewsRoutes);
app.use('/api', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/sessions', userRoutes);

// Configurar los endpoints de Swagger
app.use('/api-docs/products', swaggerUi.serve, swaggerUi.setup(productDocumentation));
app.use('/api-docs/carts', swaggerUi.serve, swaggerUi.setup(cartDocumentation));
app.use('/api-docs/users', swaggerUi.serve, swaggerUi.setup(userDocumentation));

initializePassport();
const httpServer = app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
});

const socketServer = new Server(httpServer);

socketProducts(socketServer);
socketChat(socketServer);

export default app;