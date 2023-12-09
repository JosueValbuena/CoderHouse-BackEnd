import passport from "passport";
import { logger } from "../utils/index.logger.js";

export const accesPrivacyMiddleware = (requiredRole) => {
    return (req, res, next) => {
        passport.authenticate('current', { session: false }, (err, user, info) => {

            if (err) return next(err);

            if (!user) return res.status(401).json({ status: 'Error', message: 'Acceso no autorizado' });

            if (user.role === requiredRole) {
                req.logger.info('Acceso permitido');
                next()
            } else {
                req.logger.error('No tienes permisos para acceder a este contenido');
                return res.status(403).json({ status: 'Error', message: 'Acceso denegado' });
            };
        })(req, res, next);
    };
};

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    next();
};