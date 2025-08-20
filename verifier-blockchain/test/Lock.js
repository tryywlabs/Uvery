import pkg from 'hardhat';
import { expect } from 'chai';
const { ethers } = pkg;

/**
 * FILE: Smart Contract Test Cases
 *
 */

describe('CertificateVerifier', async function () {
  let contract, owner, institution1, institution2, outsider;
  this.beforeEach(async () => {
    [owner, institution1, institution2, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('CertificateVerifier'); //Gets contract ABI through the getContractFactory method
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  /**
   * TEST CASES
   * 1. Owner can authorize institutions
   * 2. Authorised Institutions can Add Certificates
   * 3. Unauthorized Institutions cannot add certificates
   * 4.
   */
  it('Owner can authorise institutions', async () => {
    await expect(contract.authorizeInstitution(institution1.address)).to.emit(
      contract,
      'InstitutionAuthorized'
    );

    await expect(
      contract
        .connect(institution1)
        .addCertificate('exampleFileHashForTest', 'student@example.edu', 'PGT')
    ).to.emit(contract, 'CertificateAdded');
  });

  it('Authorised Institution can add certificates', async () => {
    await contract.authorizeInstitution(institution1.address);
    const transcript = await contract
      .connect(institution1)
      .addCertificate('exampleFileHashForTest', 'student@example.edu', 'PGT');
    const receipt = await transcript.wait();
    const event = receipt.logs.find(
      (l) => l.fragment?.name === 'CertificateAdded'
    );
    expect(event).to.not.be.undefined;
  });

  it('Unauthorized Institutions cannot add certificates', async () => {
    await expect(
      contract
        .connect(outsider)
        .addCertificate('exampleFileHashForTest', 'student@example.edu', 'PGT')
    ).to.be.revertedWith('Only authorized institutions can add certificates');
  });
});
