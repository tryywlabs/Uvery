const { ethers } = require('hardhat');

async function main() {
  const Contract = await ethers.getContractFactory('CertificateVerifier');
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  console.log('Certificate Verifier deployed to:', await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
