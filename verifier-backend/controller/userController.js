//Handle requests & process data & generate responses
import User from '../model/userModel.js';

/* 
Controller Functions for User Management:
1. createUser: Handles user creation, checks for existing users by email.
2. getAllUsers: Retrieves all users from the database.
3. getUserById: Fetches a user by their ID.
4. updateUser: Updates user details based on their ID.
5. deleteUser: Deletes a user by their ID.
 */

//1. POST Create New User
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const { email } = newUser;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ errorMessage: 'User for this Institution already exists.' });
    }

    const savedData = await newUser.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ errorMessage: 'Error creating user', error });
  }
};

//2. GET Get all Users
export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error fetching users', error });
  }
};

//3. GET Get User by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(userExists);
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error fetching user', error });
  }
};

//4. PUT Update User
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await User.findByIdAndUpdate(userId, req.body, { new: true });
    //function will return the updated document, not the original
    //if you want the original, set { new: false }, which is the default behaviour
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error updating user', error });
  }
};

//5. DELETE Remove User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error deleting user', error });
  }
};
