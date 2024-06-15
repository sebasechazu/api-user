'use strict';

import Router  from 'express';
const userRoutes = Router();

import { ensureAuth } from '../middlewares/authenticated';
import { getUser, registerUser, loginUser } from '../controllers/user.controller';

userRoutes.get('/user/:id', ensureAuth, getUser);
userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);

export default userRoutes;