import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.routes.js";
import cors from 'cors';
import passport from "passport";
import { loggerMiddleware } from "./middlewares/index.middlewares.js";
import { logger } from "./utils/index.logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from 'swagger-ui-express';

//configs
dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

//mongo
const mongoEnviroment = async () => {
    try {
        await mongoose.connect(process.env.DB_SECRET_KEY);
        logger.info('Conectado con mongoose');
    } catch (error) {
        logger.error('Error al conectar con mogoose: ', error.message);
    }
};

mongoEnviroment();

//swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion Proyecto Backend',
            description: 'Documentacion para el proyecto final de backend para coderhouse, por Josue Valbuena',
            version: '1.0.0'
        },
    },
    apis: ['./src/docs/users/users.yaml', './src/docs/products/products.yaml', './src/docs/carts/carts.yaml']
};

let swaggerSpecs;

try {
    swaggerSpecs = swaggerJSDoc(swaggerOptions);
    logger.info('Especificaciones Swagger generadas correctamente');
} catch (error) {
    logger.error('Error al generar las especificaciones Swagger: ', error);
};

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.ORIGIN_ONLINE, process.env.ORIGIN_OFFLINE],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));
app.use(passport.initialize());

app.use(loggerMiddleware);
app.use('/', router);
app.use('/api/docs', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpecs));
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    logger.info(`Server started on port ${port}`)
})