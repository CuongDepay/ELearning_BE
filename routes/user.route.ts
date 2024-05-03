import express from 'express';
import { registrationUser, activateUser, loginUser, logoutUser } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activateUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', isAuthenticated,logoutUser);

export default userRouter;