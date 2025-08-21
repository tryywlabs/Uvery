import express from 'express';
import multer from 'multer';
import {
  addCertificateToBlockchain,
  verifyCertificate,
  testBlockchainConnection,
} from '../controller/certController.js';

/**
 * FILE: Route definitions for certificate-related API calls
 * DESCRIPTION: Defines Routes for testing, adding, verifying, uploading and registering files
 * USE: Used as endpoints to invoke BlockchainService methods
 */

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//To Test: Check CURL connection to the blockchain routes
// Example CURL command: curl -X GET http://localhost:8000/api/certificate/test-connection
router.get('/test-connection', testBlockchainConnection);
router.post('/add-certificate', addCertificateToBlockchain);
router.get('/verify-certificate/:fileHash', verifyCertificate);

//Upload, Hash, Register Certificate
router.post(
  '/upload-certificate',
  upload.single('certificate'),
  async (req, res) => {
    req.filePath = req.file.path;
    req.originalName = req.file.originalname;
    return addCertificateToBlockchain(req, res);
  }
);

//Verify Certificate by File Hash
router.post(
  '/verify-certificate',
  upload.single('certificate'),
  verifyCertificate // Pass req and res directly; controller will hash the file
);

export default router;
