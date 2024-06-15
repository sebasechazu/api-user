'use strict';

import Router from 'express';
const userRoutes = Router();

import { authenticateUser } from '../services/jwt.js';
import { getUser, registerUser, loginUser, getUsers } from '../controllers/user.controller.js';

userRoutes.get('/user/:id',authenticateUser,  getUser);
userRoutes.get('/users', authenticateUser, getUsers);

userRoutes.post('/login', loginUser);
userRoutes.post('/register', registerUser);

export default userRoutes;