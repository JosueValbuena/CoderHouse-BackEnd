import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.routes.js";
import cors from 'cors';
import passport from "passport";

dotenv.config();

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.ORIGIN_ONLINE, process.env.ORIGIN_OFFLINE],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));
app.use(passport.initialize());

const mongoEnviroment = async () => {
    try {
        await mongoose.connect(process.env.DB_SECRET_KEY);
        console.log('Conectado con mongoose');
    } catch (error) {
        console.error('Error al conectar con mogoose: ', error.mesage);
    }
};

mongoEnviroment();

app.use('/', router);
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})