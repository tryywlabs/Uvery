import crypto from 'crypto';
import fs from 'fs';
import blockchainService from '../services/blockchainService.js';
// import { connected } from 'process';

/*
 * 1. generateFileHash: Generates a SHA-256 hash of the file at given filePath
 * 2. testBlockchainConnection: Tests the connection to the blockchain and retrieves wallet address
 * 3. addCertificateToBlockchain: Adds a certificate to the blockchain with file hash
 * 4. verifyCertificate: Verifies a certificate on the blockchain using file hash
 */

const generateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

// Test for Blockchain
export const testBlockchainConnection = async (req, res) => {
  try {
    const isConnected = await blockchainService.testConnection();
    const walletAddress = blockchainService.getWalletAddress();

    res.status(200).json({
      message: 'Blockchain connection successful',
      connected: isConnected,
      walletAddress,
    });
  } catch (error) {
    console.error('Blockchain connection error:', error);
    res.status(500).json({
      errorMessage: 'Error testing blockchain connection',
      error: error.message,
    });
  }
};

// Add certificate to blockchain
export const addCertificateToBlockchain = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : req.body.filePath;
    const studentEmail = req.body.studentEmail;
    const certificateType = req.body.certificateType;

    if (!filePath || !studentEmail || !certificateType) {
      return res.status(400).json({
        errorMessage: 'Missing required fields',
      });
    }

    // Generate file hash
    const fileHash = await generateFileHash(filePath);
    console.log('Generated file hash:', fileHash);

    // Add to blockchain
    const blockchainResult = await blockchainService.addCertificate(
      fileHash,
      studentEmail,
      certificateType
    );

    if (blockchainResult.success) {
      res.status(201).json({
        message: 'Certificate added to blockchain successfully',
        fileHash,
        transactionHash: blockchainResult.transactionHash,
        certificateId: blockchainResult.certificateId,
      });
    } else {
      res.status(500).json({
        errorMessage: 'Failed to add certificate to blockchain',
        error: blockchainResult.error,
      });
    }
  } catch (error) {
    console.error('Error in addCertificateToBlockchain:', error);
    res.status(500).json({
      errorMessage: 'Internal server error',
      error: error.message,
    });
  }
};

// Verify certificate on blockchain
export const verifyCertificate = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : req.body.filePath;
    if (!filePath) {
      return res.status(400).json({
        errorMessage: 'No File Uploaded or filepath missing',
      });
    }

    const fileHash = await generateFileHash(filePath);
    // Query blockchain for filehash
    const result = await blockchainService.verifyCertificate(fileHash);

    if (result && result.exists) {
      console.log('Certificate found on blockchain:', result);
      const {
        certificateId,
        institution,
        studentEmail,
        certificateType,
        timestamp,
        isValid,
      } = result;

      res.status(200).json({
        message: 'Certificate verified successfully',
        exists: true,
        certificate: {
          certificateId: certificateId?.toString(), //Convert BigInt to string for parsing.
          institution,
          studentEmail,
          certificateType,
          timestamp: timestamp?.toString(),
          isValid,
        },
      });
    } else {
      console.log('Certificate Not Found on blockchain');
      res.status(404).json({
        errorMessage: 'Certificate Not Found on Blockchain',
        fileHash,
        exists: false,
      });
    }
  } catch (error) {
    console.error('Error in verifyCertificateOnBlockchain:', error);
    res.status(500).json({
      errorMessage: 'Failed to verify certificate',
      error: error.message,
    });
  }
};
