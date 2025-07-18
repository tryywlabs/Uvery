//Define endpoints, map them to controller functions, and export the router

import express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controller/userController.js';

const route = express.Router();

route.post('/user', createUser);
route.get('/users', getAllUsers);
route.get('/user/:id', getUserById);
route.put('/update/user/:id', updateUser);
route.delete('/delete/user/:id', deleteUser);

export default route;
