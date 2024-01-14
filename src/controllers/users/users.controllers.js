import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { usersService } from "../../repository/index.repository.js";
import CurrentUser from "../../DTOs/users/users.dto.js";
import UserLogin from "../../DTOs/users/user_loggin.dto.js";
import nodeMailer from 'nodemailer';
import { createhash, isValidPassword } from '../../config/passport.config.js';
import { isValidObjectId } from 'mongoose';

dotenv.config();


export const getAllUsers = async (req, res) => {
    try {
        const result = await usersService.getAllUsers(req);
        res.status(201).json({ status: 'Success', result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const result = await usersService.registerUser(first_name, last_name, email, age, password, role, req);

        if (result.status === 'Error') return res.status(500).json({ status: 'Error', message: result.message });

        res.status(201).json({ status: 'Success', message: 'Usuario creado con exito' })
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await usersService.loginUser(email, password, req);

        if (result.status === 'Error') return res.status(401).json({ status: 'Error', message: result.message });

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        if (!token) return res.json({ status: 'Error', message: 'Error al firmar el token' });
        let user = new UserLogin(result);
        res.status(200).json({ status: 'Success', message: 'Usuario logueado con exito', token, payload: user });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
};

export const getUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const validId = isValidObjectId(id);
        if (!validId) return res.status(400).json({ status: 'Error', message: 'El ID no es un tipo de dato valido' });
        const result = await usersService.getUserByID(id);
        if (result.status === 'Error') return res.json({ status: 'Error', message: result.message });
        res.status(200).json({ status: 'Success', result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    };
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        let result = new CurrentUser(user);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
};

export const passwordForgot = async (req, res) => {
    try {
        const { email } = req.body;
        const verifyEmail = await usersService.verifyEmail(email);
        if (!verifyEmail) return res.status(400).json({ status: 'Error', message: 'Email no encontrado en base de datos' })
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const transporter = nodeMailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        });

        const link = `http://localhost:3001/api/users/password-recovery/${token}`;

        const mailOptions = {
            from: 'joshvlbn@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: ${link}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                req.logger.error(error);
                return res.status(500).send('Error al enviar correo de recuperacion');
            };
            req.logger.info('Correo de recuperacion enviado correctamente')
            res.status(200).json({ status: 'Succes', message: 'Correo de recuperacion enviado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    }
};

export const passwordRecoveryToken = async (req, res) => {
    try {
        const { token } = req.params;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.logger.info('Token valido');
            res.redirect(`http://localhost:3000/password-recovery/${token}`);
        } catch (error) {
            req.logger.error('Token vencido');
            res.redirect(`http://localhost:3000/password-forgot`);
        }
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    }
};

export const passwordRecovery = async (req, res) => {
    try {
        const { password, token } = req.body;
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const email = decode.email;

        const userData = await usersService.verifyEmail(email);

        const samePassword = isValidPassword(userData, password);

        if (samePassword) {
            req.logger.error('La nueva contraseña no puede ser igual a la anterior')
            return res.json({ status: 'Error', message: 'La nueva contraseña no puede ser igual a la anterior' });
        } else {
            const newPassword = createhash(password);

            const changePassword = await usersService.passwordRecovery(email, newPassword);

            if (!changePassword) return res.json({ status: 'Error', message: 'No se pudo actualizar la contraseña' });

            res.status(200).json({ status: 'Success', message: 'La contraseña se recuperó con éxito' });
        }
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    }
};

export const userRolePremium = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        if (!uid || !role) return res.status(400).json({ status: 'Error', message: 'Datos incompletos' });
        const result = await usersService.userRolePremium(uid, role);
        if (result.status === 'Error') return res.status(404).json({ status: result.status, message: result.message });
        res.status(200).json({ status: 'Success', message: 'Rol de usuario cambiado con exito', result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    }
};