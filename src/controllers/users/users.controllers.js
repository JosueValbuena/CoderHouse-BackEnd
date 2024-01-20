import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { usersService } from "../../repository/index.repository.js";
import CurrentUser from "../../DTOs/users/currentUser.dto.js";
import UserLogin from "../../DTOs/users/user_loggin.dto.js";
import nodeMailer from 'nodemailer';
import { createhash, isValidPassword } from '../../config/passport.config.js';
import { isValidObjectId } from 'mongoose';
import AllUsers from '../../DTOs/users/allUsers.dto.js';

dotenv.config();


export const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.getAllUsers(req);
        const usersFilter = new AllUsers(users);
        const result = usersFilter.getUsers();
        res.status(200).json({ status: 'Success', payload: result });
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
        const result = new CurrentUser(user);
        res.status(200).json({ status: 'Success', payload: result });
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
    };
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
    };
};

export const postFile = async (req, res) => {
    try {
        if (!req.files) return res.status(400).json({ status: 'Error', message: 'No hay archivo adjunto' });
        const { uid, type } = req.params;
        const fileReference = req.files[0].path;
        if (!uid || !type) return res.status(400).json({ satus: 'Error', message: 'Parametros incompletos' });
        const fileName = type;
        const result = await usersService.postFile(uid, fileName, fileReference);
        res.status(201).json({ status: 'Success', message: 'Archivo cargado con exito', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    };
};

export const inactiveUsers = async (req, res) => {
    try {
        const users = await usersService.inactiveUsers();
        if (!users) return res.status(404).json({ status: 'Error', message: 'No se encontraton usuarios' });
        const result = users.filter(user =>
            Date.now() - user.last_connection >= 5 * 86400000);
        res.status(200).json({ status: 'Succes', message: 'usuarios inactivos por mas de 5 dias', payload: result });
        // El requerimiento de eliminar usuarios con mas de 2 dias sin conexion lo he sustituido solo por traer su informacion
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor al buscar usuarios inactivos',
            error: error.message
        });
    };
};

export const deleteUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        const validId = isValidObjectId(uid);
        if (!validId) return res.status(400).json({ status: 'Error', message: 'ID de usuario no valido' });
        const result = await usersService.deleteUserById(uid);
        if (result.status === 'Error') return res.status(result.code).json({
            status: result.status,
            message: result.message
        });
        req.logger.info('Usuario eliminado con exito');
        res.status(204).end();
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor al eliminar usuario por ID',
            error: error.message
        });
    };
};

export const editUserByID = async (req, res) => {
    try {
        const { uid } = req.params;
        const { first_name, last_name, email, role } = req.body;
        const newInfoUser = {
            first_name,
            last_name,
            email,
            role
        };
        const validId = isValidObjectId(uid);

        if (!validId) return res.status(400).json({
            status: 'Error',
            message: 'El ID del usuario no es valido'
        });

        if (!first_name || !last_name || !email || !role) return res.status(400).json({
            status: 'Error',
            message: 'Falta informacion del usuario en la consulta'
        });

        const result = await usersService.editUserByID(uid, newInfoUser);

        if (result.status === 'Error') return res.status(result.code).json({
            status: result.status,
            message: result.message
        });

        res.status(200).json({
            status: 'Success',
            message: 'Usuario editado con exito',
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor al editar usuario por ID',
            error: error.message
        });
    };
};