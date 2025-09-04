//AI Assisted
//Claude Sonnet 3.7

import { ethers } from 'hardhat';

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const institutionAddress = process.env.WALLET_ADDRESS; //FURTHER IMPLMENTATION: Allow dynamic input

  const CertificateVerifier = await ethers.getContractFactory(
    'CertificateVerifier'
  );
  const contract = CertificateVerifier.attach(contractAddress);

  const tx = await contract.authorizeInstitution(institutionAddress);
  await tx.wait();

  console.log('Institution authorized successfully:', institutionAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
