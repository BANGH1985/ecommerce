import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import bodyParser from "body-parser";

import productRoutes from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import viewsRoutes from "./routes/viewsRoutes.js";
import sessionsRouter from "./routes/sessions.js";

import initializePassport from "./config/passport.config.js";
import connectToDB from "./config/configServer.js";

import socketProducts from "./listener/socketProducts.js";
import socketChat from "./listener/socketChat.js";


const app = express();
const PORT = 8080;

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://Dante:1985112aA.@cluster0.dr7thbm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0" }),
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// rutas
app.use("/api", productRoutes);
app.use("/api/carts", cartRouter);
app.use('/', viewsRoutes);
app.use('/api/sessions', sessionsRouter);

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}`);
    } catch (err) {
        console.log(err);
    }
});

connectToDB();
const socketServer = new Server(httpServer);

socketProducts(socketServer);
socketChat(socketServer);
