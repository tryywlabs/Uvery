//Partial AI Assistance, largely user generated

import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

/**
 * FILE: BlockchainService Class
 * DESCRIPTION: Provides methods that map 1:1 with the smart contract functions.
 * USE: Generate an instance to create a connection to the Ethereum Network.
 */

//Contract ABI methods Signatures
const CONTRACT_ABI = [
  'function addCertificate(string memory _fileHash, string memory _studentEmail, string memory _certificateType) external returns (uint256)',
  'function verifyCertificateByHash(string memory _fileHash) external view returns (bool, uint256, address, string memory, string memory, uint256, bool)',
  'function authorizeInstitution(address _institution) external',
  'function isInstitutionAuthorized(address _institution) external view returns (bool)',
  'function getTotalCertificates() external view returns (uint256)',
];

class BlockchainService {
  constructor() {
    try {
      /**
       * Initialization:
       * provider (connection abstraction to the Ethereum Network) using JSON-RPC HTTP API
       * signer (abstraction of Ethereum Account) as a Wallet instance
       */
      this.provider = new ethers.JsonRpcProvider(
        process.env.BLOCKCHAIN_PROVIDER_URL
      );
      this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      this.contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        CONTRACT_ABI,
        this.signer
      );
    } catch (error) {
      console.error(
        'Invalid parameters while initializing BlockchainService:',
        error
      );
    }
  }

  // 1. Add certificate to blockchain
  async addCertificate(fileHash, studentEmail, certificateType) {
    try {
      // console.log('Adding certificate to blockchain:', {
      //   fileHash,
      //   studentEmail,
      //   certificateType,
      // });

      const tx = await this.contract.addCertificate(
        fileHash,
        studentEmail,
        certificateType
      );
      // console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      // console.log('Transaction confirmed:', receipt.transactionHash);

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        //NOTE: AI assisted component below (Claude Sonnet 3.7)
        certificateId: receipt.logs[0]?.args?.certificateId?.toString(),
      };
    } catch (error) {
      console.error('Error adding certificate to blockchain:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 2. Verify certificate
  async verifyCertificate(fileHash) {
    try {
      // console.log('Verifying certificate with hash:', fileHash);
      const result = await this.contract.verifyCertificateByHash(fileHash);
      const [
        exists,
        certificateId,
        institution,
        studentEmail,
        certificateType,
        timestamp,
        isValid,
      ] = result;

      if (exists) {
        return {
          exists,
          certificateId,
          institution,
          studentEmail,
          certificateType,
          timestamp,
          isValid,
        };
      } else {
        return { exists: false };
      }
    } catch (error) {
      console.error('Error on the Blockchain side:', error);
      return { exists: false, error: error.message };
    }
  }

  // 3. Return whether institution is authorised
  async isInstitutionAuthorized(address) {
    try {
      return await this.contract.isInstitutionAuthorized(address);
    } catch (error) {
      console.error('Error checking institution authorization:', error);
      throw error;
    }
  }

  //Test Functions:

  // 4. Get wallet address to check correct and proper wallet connection
  getWalletAddress() {
    return this.signer.address;
  }

  // 5. Test blockchain network connection
  async testConnection() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log('Connected to blockchain, current block:', blockNumber);
      return true;
    } catch (error) {
      console.error('Blockchain connection test failed:', error);
      return false;
    }
  }
}

export default new BlockchainService();
