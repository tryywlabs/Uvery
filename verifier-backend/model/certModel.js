import mongoose from 'mongoose';

//NOTE: Not Integrated into the Application
//TODO: Implement logic for MongoDB to store metadata for faster reads

/*
 * FILE: Model for a Certificate Object
 * DESCRIPTION: Mongoose schema for representing a certificate
 * USE: Define a certificate structure for MongoDB metadata upload
 */

// Elements:
// Name
// Issued To
// Issued By
// Issue Date
// Expiration Date
// Status

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
