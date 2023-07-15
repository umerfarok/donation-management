const jwt = require('jsonwebtoken');

// Set your secret key (a long, random string) used to sign and verify tokens
const secretKey = 'your-secret-key';

// Middleware function to verify the JWT
const verifyToken = (req, res, next) => {
  // Get the JWT from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    // Token not provided
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token using the secret key
    const decodedToken = jwt.verify(token, secretKey);

    // Add the decoded token to the request object for further use
    req.decodedToken = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
