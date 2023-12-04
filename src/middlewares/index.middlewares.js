import passport from "passport";

export const accesPrivacyMiddleware = (requiredRole) => {
    return (req, res, next) => {
        passport.authenticate('current', { session: false }, (err, user, info) => {

            if (err) return next(err);

            if (!user) return res.status(401).json({ status: 'Error', message: 'Acceso no autorizado' });

            if (user.role === requiredRole) {
                console.log('Acceso permitido');
                next()
            } else {
                console.log('No tienes permisos para acceder a este contenido');
                return res.status(403).json({ status: 'Error', message: 'Acceso denegado' });
            };
        })(req, res, next);
    };
};