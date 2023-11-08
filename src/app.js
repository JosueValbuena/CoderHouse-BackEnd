import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.routes.js";
import cors from 'cors';

dotenv.config();

const port = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

const mongoEnviroment = async () => {
    await mongoose.connect(process.env.DB_SECRET_KEY);
    console.log('Conectado con mongoose')
}

mongoEnviroment();

app.use('/', router);

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})