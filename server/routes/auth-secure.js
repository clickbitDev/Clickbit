const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');
const { generateToken, verifyToken } = require('../utils/jwt');
const { rateLimit } = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const securityMiddleware = require('../middleware/security');
// Rate limiting for auth routes
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply security middleware
router.use(securityMiddleware.securityHeaders);
router.use(securityMiddleware.securityLogging);

// Enhanced validation middleware with SQL injection prevention
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .custom((value) => {
      // Additional email validation
      if (value.length > 254) {
        throw new Error('Email address is too long');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8, max: 128 }) // Increased minimum length
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 50 }) // Reduced max length
    .withMessage('First name is required and must be less than 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name contains invalid characters'),
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 50 }) // Reduced max length
    .withMessage('Last name is required and must be less than 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name contains invalid characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{7,15}$/)
    .withMessage('Please provide a valid phone number')
    .customSanitizer((value) => {
      return value ? value.replace(/[\s\-\(\)]/g, '') : value;
    })
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 })
    .withMessage('Password length is invalid')
];

const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validatePasswordUpdate = [
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// Enhanced validation error handler with security logging
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log validation failures for security monitoring
    logger.warn('Validation failed', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errors: errors.array(),
      path: req.path
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  authLimiter, 
  securityMiddleware.rateLimitByIP,
  validateRegistration, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { email, password, first_name, last_name, phone } = req.body;

      // Additional security checks
      if (email.length > 254 || password.length > 128) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input length'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        // Don't reveal if user exists (security best practice)
        return res.status(201).json({
          success: true,
          message: 'If an account with this email doesn\'t exist, you will receive a verification email.'
        });
      }

      // Create verification token with shorter expiration
      const verificationToken = jwt.sign(
        { email, type: 'email_verification' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Reduced from 24h to 1h
      );

      // Create user
      const user = await User.create({
        email,
        password,
        first_name,
        last_name,
        phone,
        email_verification_token: verificationToken
      });

      // Get dynamic frontend URL from request origin or fallback to env
      const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

      // Send verification email
      try {
        await sendEmail({
          to: email,
          subject: 'Welcome to Clickbit.com.au - Verify Your Email',
          template: 'emailVerification',
          data: {
            name: first_name,
            verificationUrl: `${frontendUrl}/#/verify-email?token=${verificationToken}`
          }
        });
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        // Don't fail the registration if email fails
      }

      // Log successful registration
      logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });

      res.status(201).json({
        success: true,
        message: 'If an account with this email doesn\'t exist, you will receive a verification email.'
      });

    } catch (error) {
      logger.error('Registration error:', {
        error: error.message,
        stack: error.stack,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', 
  validateLogin, 
  handleValidationErrors, 
  securityMiddleware.rateLimitByIP,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Additional security checks
      if (email.length > 254 || password.length > 128) {
        securityMiddleware.incrementFailedAttempts(req);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      logger.info(`Login attempt for email: ${email}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        securityMiddleware.incrementFailedAttempts(req);
        logger.warn(`Login failed: User not found for email: ${email}`, {
          ip: req.ip
        });
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Check if account is locked
      if (user.isLocked()) {
        logger.warn(`Login failed: Account locked for user: ${email}`, {
          ip: req.ip,
          userId: user.id
        });
        return res.status(423).json({
          success: false,
          message: 'Your account is temporarily locked due to too many failed login attempts. Please try again later.'
        });
      }

      // Check if account is active
      if (!user.isActive()) {
        logger.warn(`Login failed: Account not active for user: ${email}`, {
          ip: req.ip,
          userId: user.id
        });
        return res.status(401).json({
          success: false,
          message: 'Your account is not active. Please contact support.'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incrementLoginAttempts();
        securityMiddleware.incrementFailedAttempts(req);
        logger.warn(`Login failed: Invalid password for user: ${email}`, {
          ip: req.ip,
          userId: user.id
        });
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Check if email is verified for non-admin users AFTER password is confirmed
      if (user.role !== 'admin' && !user.email_verified) {
        logger.warn(`Login failed: Email not verified for user: ${email}`, {
          ip: req.ip,
          userId: user.id
        });
        return res.status(401).json({
          success: false,
          message: 'Please verify your email address to log in. Check your inbox for a verification link.'
        });
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();
      securityMiddleware.resetFailedAttempts(req);
      
      logger.info(`Password verified successfully for user: ${email}`, {
        ip: req.ip,
        userId: user.id
      });

      // Generate JWT token with shorter expiration
      const token = generateToken(user.id);

      // Log successful login
      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          token
        }
      });

    } catch (error) {
      logger.error('Login error:', {
        message: error.message,
        stack: error.stack,
        email: req.body.email,
        ip: req.ip
      });
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user and blacklist token
// @access  Private
router.post('/logout', 
  securityMiddleware.verifyTokenWithBlacklist, 
  async (req, res) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader.substring(7);
      
      // Blacklist the token
      securityMiddleware.blacklistToken(token);
      
      logger.info('User logged out successfully', {
        userId: req.user.id,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during logout'
      });
    }
  }
);

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Additional token validation
    if (decoded.type !== 'email_verification') {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(decoded.email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Check if token matches
    if (user.email_verification_token !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Update user
    await user.update({
      email_verified: true,
      email_verification_token: null
    });

    logger.info('Email verified successfully', {
      userId: user.id,
      email: user.email
    });

    // Get dynamic frontend URL from request origin or fallback to env
    const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

    res.redirect(`${frontendUrl}/#/login?verified=true`);

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// @route   GET /api/auth/verify-email
// @desc    Verify user email via GET (for email links)
// @access  Public
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    // Get dynamic frontend URL from request origin or fallback to env
    const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

    if (!token) {
      return res.redirect(`${frontendUrl}/#/login?error=no-token`);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Additional token validation
    if (decoded.type !== 'email_verification') {
      return res.redirect(`${frontendUrl}/#/login?error=invalid-token`);
    }
    
    // Find user by email
    const user = await User.findByEmail(decoded.email);
    if (!user) {
      return res.redirect(`${frontendUrl}/#/login?error=invalid-token`);
    }

    // Check if token matches (if we stored it) or just verify the JWT is valid
    if (user.email_verification_token && user.email_verification_token !== token) {
      return res.redirect(`${frontendUrl}/#/login?error=token-mismatch`);
    }

    // Update user
    await user.update({
      email_verified: true,
      email_verification_token: null
    });

    logger.info(`Email verified successfully for user: ${user.email}`, {
      userId: user.id
    });
    res.redirect(`${frontendUrl}/#/login?verified=true`);

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.redirect(`${frontendUrl}/#/login?error=expired-token`);
    }

    logger.error('Email verification error:', error);
    res.redirect(`${frontendUrl}/#/login?error=server-error`);
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', 
  authLimiter, 
  securityMiddleware.rateLimitByIP,
  validatePasswordReset, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      // Generate reset token with shorter expiration
      const resetToken = jwt.sign(
        { userId: user.id, type: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '30m' } // Reduced from 1h to 30m
      );

      // Update user with reset token
      await user.update({
        password_reset_token: resetToken,
        password_reset_expires: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      });

      // Get dynamic frontend URL from request origin or fallback to env
      const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

      // Send reset email
      try {
        await sendEmail({
          to: email,
          subject: 'Clickbit.com.au - Password Reset Request',
          template: 'passwordReset',
          data: {
            name: user.first_name,
            resetUrl: `${frontendUrl}/#/reset-password?token=${resetToken}`
          }
        });
      } catch (emailError) {
        logger.error('Failed to send password reset email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }

      logger.info('Password reset requested', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });

    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during password reset request'
      });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', 
  validatePasswordUpdate, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Reset token is required'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Additional token validation
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }
      
      // Find user
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }

      // Check if token matches and is not expired
      if (user.password_reset_token !== token || user.password_reset_expires < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Update password, clear reset token, and verify email (successful password reset should verify the user)
      await user.update({
        password,
        password_reset_token: null,
        password_reset_expires: null,
        email_verified: true,
        email_verification_token: null
      });

      logger.info('Password reset successfully', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during password reset'
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', 
  securityMiddleware.verifyTokenWithBlacklist, 
  async (req, res) => {
    try {
      // The middleware already attached the user object to the request.
      // We just need to send it back.
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching user data'
      });
    }
  }
);

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', 
  securityMiddleware.verifyTokenWithBlacklist, 
  async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate new token
      const token = generateToken(user.id);

      logger.info('Token refreshed', {
        userId: user.id,
        ip: req.ip
      });

      res.json({
        success: true,
        data: {
          token
        }
      });

    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during token refresh'
      });
    }
  }
);

module.exports = router;


