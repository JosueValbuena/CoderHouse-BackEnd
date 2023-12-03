import User from "../../dao/users/users.dao.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { usersService } from "../../repository/repositoy.index.js";
import CurrentUser from "../../DTOs/users/users.dto.js";

dotenv.config();


export const getAllUsers = async (req, res) => {
    try {
        const result = await usersService.getAllUsers();
        res.status(201).json({ status: 'Success', result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const result = await usersService.registerUser(first_name, last_name, email, age, password, role);

        if (result.status === 'Error') return res.status(500).json({ status: 'Error', message: result.message });

        res.status(201).json({ status: 'Success', message: 'Usuario creado con exito' })
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await usersService.loginUser(email, password);

        if (result.status === 'Error') return res.status(401).json({ status: 'Error', message: result.message });

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        if (!token) return res.json({ status: 'Error', message: 'Error al firmar el token' });

        res.json({ token, name: result.first_name });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
};

export const getUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await usersService.getUserByID(id);
        if (result.status === 'Error') return res.json({ status: 'Error', message: result.message });
        res.status(200).json({ status: 'Success', result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    };
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        let result = new CurrentUser(user);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
}