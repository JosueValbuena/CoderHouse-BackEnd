import { Router } from "express";
import passport from "passport";
import { deleteUserById, editUserByID, getAllUsers, getCurrentUser, getUserByID, inactiveUsers, loginUser, passwordForgot, passwordRecovery, passwordRecoveryToken, postFile, registerUser, userRolePremium } from "../../controllers/users/users.controllers.js";
import { accesPrivacyMiddleware } from "../../middlewares/index.middlewares.js";
import { upload } from "../../config/multer.config.js";

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

usersRoutes.post('/user/:uid/documents/:type', upload.array('file', 5), postFile);

usersRoutes.get('/allusers/inactive', inactiveUsers);

usersRoutes.delete('/userdelete/:uid', deleteUserById);

usersRoutes.put('/useredit/:uid', editUserByID);

export default usersRoutes;