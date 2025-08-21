import 'dotenv/config';
import dotenv from 'dotenv';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();

const SEPOLIA_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
