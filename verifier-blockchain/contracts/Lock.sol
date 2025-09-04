//AI-assisted in debugging and refactoring
//Claude Sonnet 3.7

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "hardhat/console.sol";

/*
 * FILE: Solidity Smart Contract
 * DESCRIPTION: Smart contract running on the Ethereum Testnet Server
 * USE: Deploy via Hardhat on the Sepolia Testnet: npx hardhat run scripts/deploy.js --network sepolia
 */
contract CertificateVerifier{
    //Certificate Object Attributes
    //1. FileHash (Generated in the backend)
    //2. Institution (Issuing Body)
    //3. student email (Input manually when uploading certificate)
    //4. Certificate Type (Bachelor's / PGT / PGR / PHD / Other)
    //5. Timestamp (Automatically generated)
    //6. isValid (true / false value depending on verification)

    struct Certificate {
        string fileHash;    
        address institution;
        string studentEmail;
        string certificateType;
        uint256 timestamp;
        bool isValid;
    }
    
    // Mapping from certificate ID to certificate data
    mapping(uint256 => Certificate) public certificates;
    // Mapping from file hash to certificate ID for quick lookup, allowing certificate verification by hash
    mapping(string => uint256) public hashToCertificateId;
    // Mapping to track authorized institutions
    mapping(address => bool) public authorizedInstitutions;
    // Counter for certificate ID
    uint256 public certificateCounter;
    //Admin variable
    address public owner;
    
    /*
     * Events:
     * 1. CertificateAdded
     * 2. CertificateRevoked
     * 3. InstitutionAuthorized
     * 4. InstitutionRevoked
     */

    event CertificateAdded(
        uint256 indexed certificateId,
        string fileHash,
        address indexed institution,
        string studentEmail,
        string certificateType
    );
    event CertificateRevoked(uint256 indexed certificateId);
    event InstitutionAuthorized(address indexed institution);
    event InstitutionRevoked(address indexed institution);
    
    
    /*
     * Modifiers:
     * 1. onlyOwner: Used where only contract owner can perform an action
     * 2. onlyAuthorizedInstitution: Institutions must be authorized to perform certificate uploads
     * 3. certificateExists: Used for reads by verifiers
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    modifier onlyAuthorizedInstitution() {
        require(
            authorizedInstitutions[msg.sender],
            "Only authorized institutions can add certificates"
        );
        _;
    }
    modifier certificateExists(uint256 _certificateId) {
        require(
            _certificateId > 0 && _certificateId <= certificateCounter,
            "Certificate does not exist"
        );
        _;
    }
    
    /*
     * Constructor:
     * 1. set owner as the sender of the transaction request
     * 2. initialise certificateCounter to 0 for tracking all added certificates
     */
    constructor() {
        owner = msg.sender;
        certificateCounter = 0;
    }
    
    /**
     * @dev Authorize an institution to add certificates
     * @param _institution Address of the institution to authorize
     */
    function authorizeInstitution(address _institution) external onlyOwner {
        require(_institution != address(0), "Invalid institution address");
        authorizedInstitutions[_institution] = true;
        emit InstitutionAuthorized(_institution);
    }
    
    /**
     * @dev Revoke authorization from an institution
     * @param _institution Address of the institution to revoke
     */
    function revokeInstitution(address _institution) external onlyOwner {
        authorizedInstitutions[_institution] = false;
        emit InstitutionRevoked(_institution);
    }
    
    /**
     * @dev
     * @param _fileHash
     * @param _studentEmail student email of the recipient
     * @param _certificateType B / M / PHD / Other
     * @return certificateId 
     */
    function addCertificate(
        string memory _fileHash,
        string memory _studentEmail,
        string memory _certificateType
    ) external onlyAuthorizedInstitution returns (uint256) {
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        require(bytes(_studentEmail).length > 0, "Student email cannot be empty");
        require(bytes(_certificateType).length > 0, "Certificate type cannot be empty");
        require(hashToCertificateId[_fileHash] == 0, "Certificate with this hash already exists");
        
        // Increment counter when certificate is added
        certificateCounter++;
        
        // Create new certificate
        certificates[certificateCounter] = Certificate({
            fileHash: _fileHash,
            institution: msg.sender,
            studentEmail: _studentEmail,
            certificateType: _certificateType,
            timestamp: block.timestamp,
            isValid: true
        });
        
        // Create mapping for the new certificate hash
        hashToCertificateId[_fileHash] = certificateCounter;
        
        // Emit relevant event
        emit CertificateAdded(
            certificateCounter,
            _fileHash,
            msg.sender,
            _studentEmail,
            _certificateType
        );
        return certificateCounter;
    }
    
    /**
     * @dev 
     * @param _fileHash certificate hash
     * @return exists certificate exists?
     * @return certificateId 
     * @return institution 
     * @return studentEmail 
     * @return certificateType 
     * @return timestamp 
     * @return isValid
     */
    function verifyCertificateByHash(string memory _fileHash)
        external
        view
        returns (
            bool exists,
            uint256 certificateId,
            address institution,
            string memory studentEmail,
            string memory certificateType,
            uint256 timestamp,
            bool isValid
        )
    {
        certificateId = hashToCertificateId[_fileHash];
        
        if (certificateId == 0) {
            return (false, 0, address(0), "", "", 0, false);
        }
        
        Certificate memory cert = certificates[certificateId];
        
        return (
            true,
            certificateId,
            cert.institution,
            cert.studentEmail,
            cert.certificateType,
            cert.timestamp,
            cert.isValid
        );
    }
    
    /**
     * @dev Verify a certificate by its ID
     * @param _certificateId certificate ID
     * @return certificate 
     */
    function verifyCertificateById(uint256 _certificateId)
        external
        view
        certificateExists(_certificateId)
        returns (Certificate memory)
    {
        return certificates[_certificateId];
    }
    
    //NOT IN USE CURRENTLY: Revoking is simply switching the state value to isValid = false
    function revokeCertificate(uint256 _certificateId)
        external
        certificateExists(_certificateId)
    {
        Certificate storage cert = certificates[_certificateId];
        
        // Only the issuing institution or owner can revoke
        require(
            msg.sender == cert.institution || msg.sender == owner,
            "Only institution or owner can revoke certificate"
        );
        
        cert.isValid = false;
        emit CertificateRevoked(_certificateId);
    }
    
    //Total number of certificates on network
    function getTotalCertificates() external view returns (uint256) {
        return certificateCounter;
    }
    
    //NOT IN USE: Later when user metamask wallet is required
    function isInstitutionAuthorized(address _institution) external view returns (bool) {
        return authorizedInstitutions[_institution];
    }
}
