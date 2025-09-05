//Define endpoints, map them to controller functions, and export the router

/**
 * FILE: userRoute.js
 * USE: API route definitions for user account functionlities
 * NOTE: REST endpoints used for user API calls
 */

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

// Accessible by all
route.post('/', createUser);
route.post('/signin', signinUser);

// Accessibly by authenticated users
route.get('/', getAllUsers);
route.get('/:id', getUserById);
route.put('/:id', updateUser);
route.delete('/:id', deleteUser);
route.post('/signout', signoutUser);

export default route;
