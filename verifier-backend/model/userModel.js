//Manage structure of data & DB interactions

import mongoose from 'mongoose';

// Define schema for user accounts
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
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
