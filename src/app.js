import express from "express"
import session from "express-session"
import path from "path"
import Handlebars from "handlebars"
import MongoStore from "connect-mongo"
import { create } from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import viewsRouter from "./routes/views.router.js"
import sessionRouter from "./routes/session.router.js"
import mongoose from "mongoose"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { __dirname } from "./utils.js"



const PORT = 8080
const app = express()

// Configuración de Handlebars
const hbs = create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
});


// Configuración del motor de plantillas
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public'))); // Cambiado a '/public' para servir archivos estáticos

mongoose.connect("mongodb+srv://devpavez:20232023@clusterpavez.pg1fh.mongodb.net/LoginForm?retryWrites=true&w=majority")
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://devpavez:20232023@clusterpavez.pg1fh.mongodb.net/LoginForm?retryWrites=true&w=majority&appName=ClusterPavez",
        collectionName: 'MySessions'
    }),
    secret:"coderhouse",
    resave:false,
    saveUninitialized:false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/",sessionRouter)
app.use("/",viewsRouter)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

