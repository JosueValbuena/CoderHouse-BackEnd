import bcrypt from 'bcrypt';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

//encriptar contrasenha
export const createhash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));