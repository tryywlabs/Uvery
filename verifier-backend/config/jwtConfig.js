/**
 * FILE: jwtConfig.js
 * USE: Configure secret key for JWT signing
 */

const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = {
  secretKey: secretKey,
};
