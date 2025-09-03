//Self-Written
import mongoose from 'mongoose';

/**
 * FILE: userModel Schema
 * DESCRIPTION: Mongoose Schema for User Accounts
 * USE: Define user document structure for MongoDB
 */

// ELEMENTS:
// 1. Username
// 2. Email
// 3. Password (Hashed)
// 4. Institution Type
// 5. JWT Token

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  // Unique Identifier
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  institutionType: {
    type: String,
    enum: ['University', 'College', 'Training Institute', 'Certification Body'],
    required: true,
  },
  token: {
    type: String,
    defult: null,
  },
});

export default mongoose.model('Users', userSchema, 'Institution_Users');
