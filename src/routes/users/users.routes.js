import { Router } from "express";
import passport from "passport";
import { getAllUsers, getUserByID, loginUser, registerUser } from "../../controllers/users/users.controllers.js";


const usersRoutes = Router();

usersRoutes.get('/allusers', getAllUsers);

usersRoutes.get('/user/:id', getUserByID);

usersRoutes.post('/register', registerUser)

usersRoutes.post('/login', loginUser);

usersRoutes.get('/profile', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
        const user = req.user.toObject();
        delete user.password;
        res.json({ user });
    } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Error al optener datos de usuario', error })
    }
});

export default usersRoutes;