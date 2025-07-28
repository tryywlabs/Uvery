// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerifier {
    // Structure to store certificate data
    struct Certificate {
        string fileHash;        // SHA-256 hash of the uploaded file
        address institution;         // Institution that issued the certificate
        string studentEmail;    // Student's email
        string certificateType; // Type of certificate (degree, diploma, etc.)
        uint256 timestamp;      // When the certificate was added
        bool isValid;          // Whether the certificate is still valid
    }
    
    // Mapping from certificate ID to certificate data
    mapping(uint256 => Certificate) public certificates;
    
    // Mapping from file hash to certificate ID (for quick lookup)
    mapping(string => uint256) public hashToCertificateId;
    
    // Mapping to track authorized institutions
    mapping(address => bool) public authorizedInstitutions;
    
    // Counter for certificate IDs
    uint256 public certificateCounter;
    
    // Contract owner (can authorize institutions)
    address public owner;
    
    // Events
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
    
    // Modifiers
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
     * @dev Add a new certificate to the blockchain
     * @param _fileHash SHA-256 hash of the certificate file
     * @param _studentEmail Email of the student receiving the certificate
     * @param _certificateType Type of certificate (e.g., "Bachelor's Degree")
     * @return certificateId The ID of the newly created certificate
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
        
        // Increment counter
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
        
        // Map hash to certificate ID for quick lookup
        hashToCertificateId[_fileHash] = certificateCounter;
        
        // Emit event
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
     * @dev Verify a certificate by its file hash
     * @param _fileHash SHA-256 hash of the certificate file to verify
     * @return exists Whether the certificate exists
     * @return certificateId ID of the certificate
     * @return institution Address of the institution that issued it
     * @return studentEmail Email of the student
     * @return certificateType Type of certificate
     * @return timestamp When it was issued
     * @return isValid Whether it's still valid
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
     * @param _certificateId ID of the certificate to verify
     * @return certificate The certificate data
     */
    function verifyCertificateById(uint256 _certificateId)
        external
        view
        certificateExists(_certificateId)
        returns (Certificate memory)
    {
        return certificates[_certificateId];
    }
    
    /**
     * @dev Revoke a certificate (mark as invalid)
     * @param _certificateId ID of the certificate to revoke
     */
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
    
    /**
     * @dev Get total number of certificates issued
     * @return Total number of certificates
     */
    function getTotalCertificates() external view returns (uint256) {
        return certificateCounter;
    }
    
    /**
     * @dev Check if an institution is authorized
     * @param _institution Address to check
     * @return Whether the institution is authorized
     */
    function isInstitutionAuthorized(address _institution) external view returns (bool) {
        return authorizedInstitutions[_institution];
    }
}