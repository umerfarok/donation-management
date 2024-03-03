const jwt = require('jsonwebtoken');

const secretKey = require('./constants').secretKey;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {

    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
