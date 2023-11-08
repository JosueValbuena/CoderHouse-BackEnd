import { Router } from "express";
import usersModel from "../../models/user/user.model.js";
import { createhash, isValidPassword } from "../../config/passport.config.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

const usersRoutes = Router();

usersRoutes.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        const user = await usersModel.findOne({ email: email });

        if (user) return res.send({ status: 'error', message: 'usuario ya existe' });

        const userRole = role || 'user';

        const newUser = {
            first_name,
            last_name,
            email,
            age: Number(age),
            password: createhash(password),
            role: userRole
        };

        let result = await usersModel.create(newUser);
        console.log(result);
        res.status(201).send({ status: 'Success', message: 'Usuario creado con exito' })
    } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Error en el servidor' })
    }
})

usersRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await usersModel.findOne({ email: email });

        if (!user) return res.status(401).send({ status: 'Error', message: 'Error al verificar usuario' });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: 'Error', message: 'Contrasenha del usuario incorrecta' });

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        if (!token) return res.send({ status: 'Error', message: 'Error al firmar el token' });

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        console.log({ email, password, token });
        res.json({ token, name: user.first_name });
    } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Error en la autenticacion' })
    }
});

export default usersRoutes;