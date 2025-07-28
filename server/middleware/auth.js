const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../utils/logger');
const { hasPermission } = require('../config/roles');

// Middleware to verify JWT and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check for specific permissions or roles
const authorize = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'User not found for authorization' });
    }

    const userRole = req.user.role;
    
    // Check if any of the allowed permissions are granted to the user's role
    const hasAnyPermission = allowedPermissions.some(permission => {
      // If permission is a role name (admin, manager, customer), check role directly
      if (permission === 'admin' || permission === 'manager' || permission === 'customer') {
        return userRole === permission;
      }
      // Otherwise, check permissions using the roles config
      return hasPermission(userRole, permission);
    });
    
    if (!hasAnyPermission) {
      return res.status(403).json({ 
        message: `Access denied. Your role ('${userRole}') is not authorized to perform this action.` 
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize }; 