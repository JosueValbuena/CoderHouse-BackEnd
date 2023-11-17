import bcrypt from 'bcrypt';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import usersModel from '../models/user/user.model.js';
dotenv.config();

//encriptar contrasenha
export const createhash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//comparar contrasenhas
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

//passport JWT strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY
};

passport.use('current', new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await usersModel.findOne({ email: jwt_payload.email });

        if (!user) return done(null, false, { message: 'usuario no encontrado' });

        return done(null, user);
    } catch (error) {
        return done(error, false, { message: 'Error al buscar el usuario' })
    };
}));
