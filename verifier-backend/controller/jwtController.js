/*
 * DEPRECATED as of 21.07.25
 * JWT Handled directly in userController.js
 * This file is kept for reference and future use if needed.
 */

//Generate JWT with this export

// const jwt = require('jsonwebtoken');
// const { secretKey } = require('../config/jwtConfig.js');

// // function generateToken(user) {
// //   const payload = {
// //     username: user.username,
// //     email: user.email,
// //     password: user.password,
// //     institutionType: user.institutionType,
// //   };
// //   //set to 1 day for testing purposes
// //   //TODO: Change to 7 days for production
// //   return jwt.sign(payload, secretKey, { expiresIn: '1d' });
// // }

// export const generateToken = (user) => {
//   return jwt.sign(
//     {
//       userId: userData._id,
//       email: userData.email,
//       institutionType: userData.institutionType,
//     },
//     secretKey,
//     {
//       expiresIn: '120s', // Set token expiration to 120 seconds
//     }
//   );
// };

// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, secretKey);
//   } catch (error) {
//     throw new Error('Invalid token');
//   }
// };
