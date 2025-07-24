//Define endpoints, map them to controller functions, and export the router

import express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  signinUser,
  signoutUser,
} from '../controller/userController.js';

const route = express.Router();

//Public Routes
route.post('/', createUser);
route.post('/signin', signinUser);

//Protected Routes (Requires Authentication)
route.get('/', getAllUsers);
route.get('/:id', getUserById);
route.put('/:id', updateUser);
route.delete('/:id', deleteUser);
route.post('/signout', signoutUser);

export default route;
