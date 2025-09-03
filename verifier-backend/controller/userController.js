//Handle requests & process data & generate responses
import User from '../model/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidDomain } from './reference/valid.js';
// import './reference/allowedInst.json' assert { type: 'json' };

/* 
Controller Functions for User Management:
1. createUser: Handles user creation, checks for existing users by email.
2. getAllUsers: Retrieves all users from the database.
3. getUserById: Fetches a user by their ID.
4. updateUser: Updates user details based on their ID.
5. deleteUser: Deletes a user by their ID.
6. signinUser: Authenticates a user and returns JWT token.
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

    if (!isValidDomain(email)) {
      return res.status(401).json({
        message:
          'Invalid education domain. Please use a valid institution email address.',
      });
    }

    //Hash password before saving, 10 rounds of salting
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const savedData = await newUser.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ errorMessage: 'Server Error creating user', error });
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
    res
      .status(500)
      .json({ errorMessage: 'Server Error fetching users', error });
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

//6. POST Signin for existing User
export const signinUser = async (req, res) => {
  try {
    //Debugging logs
    // console.log('Request body received:', req.body);
    // console.log('Request content-type:', req.get('Content-Type'));

    if (!req.body) {
      return res.status(400).json({ errorMessage: 'Request body is empty.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: 'Invalid email or password.' });
    }

    // Use async bcrypt.compare instead of sync
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ errorMessage: 'Invalid email or password.' });
    }

    const { password: userPassword, ...userData } = user.toObject();

    //JWT Token Creation and Validation
    let token;

    // Check if user already has a valid token
    if (user.token) {
      try {
        // Use jwt directly instead of external jwtController
        const decoded = jwt.verify(
          user.token,
          process.env.JWT_SECRET || 'fallback-secret'
        );
        if (decoded.userId === user._id.toString()) {
          token = user.token; // Use existing token if valid
        }
      } catch (error) {
        console.error('Invalid existing token, generating new:', error);
      }
    }

    // Generate new token if needed
    if (!token) {
      token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          institutionName: user.institutionType,
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '5d' }
        //Testing Completed with 120 seconds, changed to 5 days for production
      );

      user.token = token; // Save new token to user
      await user.save();
      //debug for newly generated token
      // console.log('New token generated:', token);
    }

    res.status(200).json({
      message: 'User signed in successfully',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Error signing in user:', error);
    res
      .status(500)
      .json({ errorMessage: 'Error signing in user', error: error.message });
  }
};

//7. POST Signout user
export const signoutUser = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.token = null; // Clear the token
    await user.save();

    res.status(200).json({ message: 'User signed out successfully.' });
  } catch (error) {
    console.error('Error signing out user:', error);
    res.status(500).json({ errorMessage: 'Error signing out user', error });
  }
};
