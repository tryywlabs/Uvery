import mongoose from 'mongoose';

// Define schema for user accounts
const certSchema = new mongoose.Schema({
  certName: {
    type: String,
    required: true,
  },
  issuedTo: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active',
  },
});

export default mongoose.model(
  'Certificates',
  certSchema,
  'Institution_Certificates'
);
