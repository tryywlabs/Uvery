//AI Assisted
//Claude Sonnet 3.7

import pkg from 'hardhat';
import { expect } from 'chai';
const { ethers } = pkg;

describe('CertificateVerifier', function () {
  let contract, owner, institution1, institution2, outsider, student;
  let testCertificateHash, testStudentEmail, testCertType;

  beforeEach(async () => {
    [owner, institution1, institution2, outsider, student] =
      await ethers.getSigners();
    const Factory = await ethers.getContractFactory('CertificateVerifier');
    contract = await Factory.deploy();
    await contract.waitForDeployment();

    // Sample test data
    testCertificateHash = 'yesterdayallmyproblemsseemedsofaraway';
    testStudentEmail = 'student@student.gla.ac.uk';
    testCertType = 'PGT';
  });

  describe('Institution Authorization', () => {
    // Test Case 1: Owner can authorize institutions
    it('Owner can authorize institutions', async () => {
      await expect(contract.authorizeInstitution(institution1.address))
        .to.emit(contract, 'InstitutionAuthorized')
        .withArgs(institution1.address);

      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .true;
    });

    // Test Case 2: Owner can authorize multiple institutions
    it('Owner can authorize multiple institutions', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract.authorizeInstitution(institution2.address);

      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .true;
      expect(await contract.isInstitutionAuthorized(institution2.address)).to.be
        .true;
    });

    // Test Case 3: Non-owner cannot authorize institutions
    it('Non-owner cannot authorize institutions', async () => {
      await expect(
        contract.connect(outsider).authorizeInstitution(institution2.address)
      ).to.be.revertedWith('Only owner can perform this action');
    });

    // Test Case 4: Cannot authorize zero address
    it('Cannot authorize zero address', async () => {
      await expect(
        contract.authorizeInstitution(ethers.ZeroAddress)
      ).to.be.revertedWith('Invalid institution address');
    });
  });

  describe('Institution Revocation', () => {
    // Test Case 5: Owner can revoke institutions
    it('Owner can revoke institutions', async () => {
      await contract.authorizeInstitution(institution1.address);
      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .true;

      await expect(contract.revokeInstitution(institution1.address))
        .to.emit(contract, 'InstitutionRevoked')
        .withArgs(institution1.address);

      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .false;
    });

    // Test Case 6: Non-owner cannot revoke institutions
    it('Non-owner cannot revoke institutions', async () => {
      await contract.authorizeInstitution(institution1.address);

      await expect(
        contract.connect(outsider).revokeInstitution(institution1.address)
      ).to.be.revertedWith('Only owner can perform this action');
    });
  });

  describe('Certificate Management', () => {
    // Test Case 7: Authorized institutions can add certificates
    it('Authorized institutions can add certificates', async () => {
      await contract.authorizeInstitution(institution1.address);

      await expect(
        contract
          .connect(institution1)
          .addCertificate(testCertificateHash, testStudentEmail, testCertType)
      )
        .to.emit(contract, 'CertificateAdded')
        .withArgs(
          1,
          testCertificateHash,
          institution1.address,
          testStudentEmail,
          testCertType
        );
      expect(await contract.certificateCounter()).to.equal(1);
    });

    // Test Case 8: Unauthorized institutions cannot add certificates
    it('Unauthorized institutions cannot add certificates', async () => {
      await expect(
        contract
          .connect(outsider)
          .addCertificate(testCertificateHash, testStudentEmail, testCertType)
      ).to.be.revertedWith('Only authorized institutions can add certificates');
    });

    // Test Case 9: Cannot add certificate with empty hash
    it('Cannot add certificate with empty hash', async () => {
      await contract.authorizeInstitution(institution1.address);

      await expect(
        contract
          .connect(institution1)
          .addCertificate('', testStudentEmail, testCertType)
      ).to.be.revertedWith('File hash cannot be empty');
    });

    // Test Case 10: Cannot add certificate with empty student email
    it('Cannot add certificate with empty student email', async () => {
      await contract.authorizeInstitution(institution1.address);

      await expect(
        contract
          .connect(institution1)
          .addCertificate(testCertificateHash, '', testCertType)
      ).to.be.revertedWith('Student email cannot be empty');
    });

    // Test Case 11: Cannot add certificate with empty certificate type
    it('Cannot add certificate with empty certificate type', async () => {
      await contract.authorizeInstitution(institution1.address);

      await expect(
        contract
          .connect(institution1)
          .addCertificate(testCertificateHash, testStudentEmail, '')
      ).to.be.revertedWith('Certificate type cannot be empty');
    });

    // Test Case 12: Cannot add duplicate certificate hash
    it('Cannot add duplicate certificate hash', async () => {
      await contract.authorizeInstitution(institution1.address);

      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      await expect(
        contract
          .connect(institution1)
          .addCertificate(testCertificateHash, 'another@example.edu', 'PHD')
      ).to.be.revertedWith('Certificate with this hash already exists');
    });
  });

  describe('Certificate Verification', () => {
    // Test Case 13: Verify certificate by hash - valid certificate
    it('Anyone can verify a valid certificate by hash', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      const verificationResult = await contract
        .connect(outsider)
        .verifyCertificateByHash(testCertificateHash);

      //NOTE: AI assisted component (Claude Sonnet 3.7)
      expect(verificationResult[0]).to.be.true; // exists
      expect(verificationResult[1]).to.equal(1); // certificateId
      expect(verificationResult[2]).to.equal(institution1.address); // institution
      expect(verificationResult[3]).to.equal(testStudentEmail); // studentEmail
      expect(verificationResult[4]).to.equal(testCertType); // certificateType
      expect(verificationResult[6]).to.be.true; // isValid
    });

    // Test Case 14: Verification returns false for non-existent certificate
    it('Verification returns false for non-existent certificate', async () => {
      const verificationResult = await contract.verifyCertificateByHash(
        'nonExistentHash'
      );

      expect(verificationResult[0]).to.be.false;
      expect(verificationResult[1]).to.equal(0);
      expect(verificationResult[2]).to.equal(ethers.ZeroAddress);
    });

    // Test Case 15: Verify certificate by ID - valid certificate
    it('Anyone can verify a valid certificate by ID', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      const cert = await contract.connect(outsider).verifyCertificateById(1);

      expect(cert.fileHash).to.equal(testCertificateHash);
      expect(cert.institution).to.equal(institution1.address);
      expect(cert.studentEmail).to.equal(testStudentEmail);
      expect(cert.certificateType).to.equal(testCertType);
      expect(cert.isValid).to.be.true;
    });

    // Test Case 16: Cannot verify non-existent certificate by ID
    it('Cannot verify non-existent certificate by ID', async () => {
      await expect(contract.verifyCertificateById(999)).to.be.revertedWith(
        'Certificate does not exist'
      );
    });
  });

  describe('Certificate Revocation', () => {
    // Test Case 17: Issuing institution can revoke certificates
    it('Issuing institution can revoke certificates', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      await expect(contract.connect(institution1).revokeCertificate(1))
        .to.emit(contract, 'CertificateRevoked')
        .withArgs(1);

      const cert = await contract.verifyCertificateById(1);
      expect(cert.isValid).to.be.false;
    });

    // Test Case 18: Owner can revoke any certificate
    it('Owner can revoke any certificate', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      await expect(contract.revokeCertificate(1))
        .to.emit(contract, 'CertificateRevoked')
        .withArgs(1);

      const cert = await contract.verifyCertificateById(1);
      expect(cert.isValid).to.be.false;
    });

    // Test Case 19: Non-issuing institution/non-owner cannot revoke certificates
    it('Non-issuing institution cannot revoke certificates', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract.authorizeInstitution(institution2.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      await expect(
        contract.connect(institution2).revokeCertificate(1)
      ).to.be.revertedWith('Only institution or owner can revoke certificate');
    });

    // Test Case 20: Cannot revoke non-existent certificate
    it('Cannot revoke non-existent certificate', async () => {
      await expect(contract.revokeCertificate(999)).to.be.revertedWith(
        'Certificate does not exist'
      );
    });

    // Test Case 21: Certificate remains revoked after revocation
    it('Certificate remains revoked after revocation', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      await contract.connect(institution1).revokeCertificate(1);

      /**
       * NOTE: Test both verification functions
       */

      // Verify by hash
      const verificationResult = await contract.verifyCertificateByHash(
        testCertificateHash
      );
      expect(verificationResult[0]).to.be.true;
      expect(verificationResult[6]).to.be.false;

      // Verify by ID
      const cert = await contract.verifyCertificateById(1);
      expect(cert.isValid).to.be.false;
    });
  });

  describe('Utility Functions', () => {
    // Test Case 22: Get total certificates count
    it('Can get total certificates count', async () => {
      expect(await contract.getTotalCertificates()).to.equal(0);

      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate('hash1', 'student1@example.edu', 'Bachelor');
      await contract
        .connect(institution1)
        .addCertificate('hash2', 'student2@example.edu', 'PGT');
      await contract
        .connect(institution1)
        .addCertificate('hash3', 'student3@example.edu', 'PHD');

      expect(await contract.getTotalCertificates()).to.equal(3);
    });

    // Test Case 23: Check institution authorization status
    it('Can check if institution is authorized', async () => {
      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .false;

      await contract.authorizeInstitution(institution1.address);
      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .true;

      await contract.revokeInstitution(institution1.address);
      expect(await contract.isInstitutionAuthorized(institution1.address)).to.be
        .false;
    });
  });

  describe('Security and Access Control', () => {
    // Test Case 24: Owner remains set after deployment
    it('Contract sets owner correctly at deployment', async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    // Test Case 25: Certificate stores correct timestamp
    it('Certificate stores correct timestamp', async () => {
      await contract.authorizeInstitution(institution1.address);
      await contract
        .connect(institution1)
        .addCertificate(testCertificateHash, testStudentEmail, testCertType);

      const cert = await contract.verifyCertificateById(1);
      const latestBlock = await ethers.provider.getBlock('latest');

      // The timestamp should be close to the block timestamp
      expect(cert.timestamp).to.be.closeTo(latestBlock.timestamp, 5);
    });
  });
});
