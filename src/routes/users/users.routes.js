import { Router } from "express";
import usersModel from "../../models/user/user.model.js";
import { createhash } from "../../config/passport.config.js";

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

export default usersRoutes;