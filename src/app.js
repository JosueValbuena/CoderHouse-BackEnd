import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.routes.js";
dotenv.config();

const port = 3001;

const app = express();

app.use('/', express.json());
app.use('/', express.urlencoded({extended: true}))
app.use('/', router);

const mongoEnviroment = async () => {
    await mongoose.connect(process.env.DB_SECRET_KEY);
    console.log('Conectado con mongoose')
}

mongoEnviroment();

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})