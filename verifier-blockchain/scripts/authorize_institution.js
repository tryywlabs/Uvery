import { ethers } from 'hardhat';

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const institutionAddress = '0x088cace2b10634b6b03A9Dca79fEd80174C3BD06'; //Hard-coded for now, replace with dynamic input

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
