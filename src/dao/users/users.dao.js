import { createhash, isValidPassword } from "../../config/passport.config.js";
import usersModel from "../../models/user/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

export default class User {

    constructor(logger) {
        this.logger = logger;
    }

    getAllUsers = async () => {
        try {
            let users = await usersModel.find();
            return users
        } catch (error) {
            this.logger.error('Error al buscar usuarios', error);
            throw new Error('Error al buscar usuarios')
        }
    };

    registerUser = async (first_name, last_name, email, age, password, role) => {
        try {
            const user = await usersModel.findOne({ email: email });
            if (user) return { status: 'Error', message: 'usuario ya existe' };
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
            return result
        } catch (error) {
            this.logger = req.logger;
            logger.error('Error al agregar usuario', error);
            throw new Error('Error al agregar usuario');
        }
    };

    loginUser = async (email, password) => {
        try {
            const result = await usersModel.findOne({ email: email });

            if (!result) return { status: 'Error', message: 'Error al verificar usuario' };
            if (!isValidPassword(result, password)) return { status: 'Error', message: 'Contrasenha del usuario incorrecta' };
            this.logger.info('Autenticado')
            return result
        } catch (error) {
            this.logger.error('Error en la autenticacion', error);
            throw new Error('Error en la autenticacion');
        }
    };

    getUserByID = async (id) => {
        try {
            const result = await usersModel.findById(id);
            if (!result) return { status: 'Error', message: 'Usuario no encontrado' };
            return result;
        } catch (error) {
            this.logger.error('Error en la autenticacion', error);
            throw new Error('Error en la autenticacion');
        }
    };

    getCurrentUser = async (email) => {
        try {
            const user = await usersModel.findOne(email);
            return user;
        } catch (error) {
            this.logger.error('Error en la autenticacion', error);
            throw new Error('Error en la autenticacion');
        }
    };

    verifyEmail = async (email) => {
        try {
            const result = await usersModel.findOne({ email });
            return result;
        } catch (error) {
            this.logger.error('Error al consultar email', error);
            throw new Error('Error al consultar email');
        }
    };

    passwordRecovery = async (email, newPassword) => {
        try {
            const result = await usersModel.updateOne({ email }, { $set: { password: newPassword } });
            return result;
        } catch (error) {
            this.logger.error('Error al cambiar contraseña', error);
            throw new Error('Error al cambiar contraseña');
        }
    };

    userRolePremium = async (uid, role) => {
        try {
            const result = await usersModel.updateOne({ _id: uid }, { $set: { role } });
            return result;
        } catch (error) {
            this.logger.error('Error al cambiar el rol a premium', error);
            throw new Error('Error al cambiar el rol a premium');
        }
    };
};