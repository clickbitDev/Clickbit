const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

// Generate JWT token
const generateToken = (userId) => {
  try {
    const payload = {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      issuer: 'clickbit.com.au',
      audience: 'clickbit-users',
      expiresIn: '24h'
    });
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token format is invalid. Use Bearer <token>'
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'clickbit.com.au',
      audience: 'clickbit-users'
    });

    // Add user info to request
    req.user = decoded;
    next();

  } catch (error) {
    logger.error('JWT verification error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token is not yet valid'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

// Decode JWT token without verification (for admin purposes)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding JWT token:', error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    logger.error('Error checking token expiration:', error);
    return true;
  }
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  try {
    const payload = {
      id: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      issuer: 'clickbit.com.au',
      audience: 'clickbit-users'
    });
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

// Generate short-lived token (for email verification, password reset, etc.)
const generateShortLivedToken = (payload, expiresIn = '1h') => {
  try {
    const tokenPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour default
    };

    return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      issuer: 'clickbit.com.au',
      audience: 'clickbit-users'
    });
  } catch (error) {
    logger.error('Error generating short-lived token:', error);
    throw new Error('Failed to generate token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  generateRefreshToken,
  generateShortLivedToken
}; 