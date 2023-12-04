import { Router } from "express";
import passport from "passport";
import { getAllUsers, getCurrentUser, getUserByID, loginUser, registerUser } from "../../controllers/users/users.controllers.js";
import { accesPrivacyMiddleware } from "../../middlewares/index.middlewares.js";


const usersRoutes = Router();

usersRoutes.get('/allusers', accesPrivacyMiddleware('admin'), getAllUsers);

usersRoutes.get('/user/:id', getUserByID);

usersRoutes.post('/register', registerUser)

usersRoutes.post('/login', loginUser);

usersRoutes.get('/profile', passport.authenticate('current', { session: false }), getCurrentUser);

export default usersRoutes;