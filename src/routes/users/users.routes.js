import { Router } from "express";
import passport from "passport";
import { getAllUsers, getCurrentUser, getUserByID, loginUser, passwordForgot, passwordRecovery, passwordRecoveryToken, registerUser, userRolePremium } from "../../controllers/users/users.controllers.js";
import { accesPrivacyMiddleware } from "../../middlewares/index.middlewares.js";


const usersRoutes = Router();

usersRoutes.get('/allusers', accesPrivacyMiddleware('admin'), getAllUsers);

usersRoutes.get('/user/:id', getUserByID);

usersRoutes.post('/register', registerUser)

usersRoutes.post('/login', loginUser);

usersRoutes.get('/profile', passport.authenticate('current', { session: false }), getCurrentUser);

usersRoutes.post('/password-forgot', passwordForgot);

usersRoutes.get('/password-recovery/:token', passwordRecoveryToken);

usersRoutes.put('/password-recovery', passwordRecovery);

usersRoutes.put('/user-role/premium/:uid', userRolePremium);

export default usersRoutes;