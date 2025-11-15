const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');
const { generateToken, verifyToken } = require('../utils/jwt');
const { rateLimit } = require('express-rate-limit');
const { protect } = require('../middleware/auth');
// Rate limiting for auth routes
const { authLimiter } = require('../middleware/rateLimiter');


const router = express.Router();



// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .trim()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
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
    .trim()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validatePasswordReset = [
  body('email')
    .isEmail()
    .trim()
    .withMessage('Please provide a valid email address')
];

const validatePasswordUpdate = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
// Process flow:
// 1. Check if email already exists in database (prompt if exists)
// 2. Generate activation token
// 3. Create user account with token
// 4. Send email with activation link
// 5. User clicks activation link (verify-email endpoint)
// 6. Database update after verification (email_verified = true, status = active)
router.post('/register', authLimiter, validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    // Get email from validated request (stored exactly as provided, no normalization)
    const { email, password, first_name, last_name, phone } = req.body;

    // Step 1: Check if email already exists in database (check first to avoid unnecessary token generation)
    logger.info(`Checking if email already exists: ${email}`);
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: Email already exists - ${email}`);
      return res.status(409).json({
        success: false,
        message: 'This email address is already registered. Please use a different email address or try logging in instead.',
        error: 'EMAIL_EXISTS'
      });
    }
    logger.info(`Email ${email} is available. Proceeding with registration...`);

    // Step 2: Generate activation token
    logger.info(`Generating activation token for email: ${email}`);
    const verificationToken = jwt.sign(
      { email, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    logger.info('Activation token generated successfully');

    // Create user with activation token (status will be 'active' by default, but email_verified is false)
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      phone,
      email_verification_token: verificationToken,
      email_verified: false, // User starts unverified
      status: 'active' // Account is active but requires email verification to login
    });

    logger.info(`User created successfully with ID: ${user.id} for email: ${email}`);

    // Get dynamic frontend URL from request origin or fallback to env
    const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

    // Step 3: Send email with activation link
    let emailSent = false;
    let emailErrorDetails = null;
    
    logger.info(`[REGISTRATION] Step 3: Preparing to send verification email to: ${email}`);
    
    try {
      logger.info(`[REGISTRATION] Attempting to send verification email to: ${email}`);
      
      // Log email configuration status
      const hasSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
      const hasGmail = process.env.GMAIL_USER && process.env.GMAIL_PASS;
      logger.info('[REGISTRATION] Email configuration check:', {
        hasSMTP,
        hasGmail,
        smtpHost: process.env.SMTP_HOST || 'Not set',
        usingEthereal: !hasSMTP && !hasGmail
      });
      
      // Ensure sendEmail is imported and available
      if (!sendEmail) {
        throw new Error('sendEmail function is not available');
      }
      
      logger.info(`[REGISTRATION] Calling sendEmail service for: ${email}`);
      const emailResult = await sendEmail({
        to: email,
        subject: 'Welcome to Clickbit.com.au - Verify Your Email',
        template: 'emailVerification',
        data: {
          name: first_name,
          verificationUrl: `${frontendUrl}/#/verify-email?token=${verificationToken}`
        }
      });
      
      emailSent = true;
      logger.info(`[REGISTRATION] Verification email sent successfully to: ${email}`, {
        messageId: emailResult.messageId,
        previewURL: emailResult.previewURL || 'N/A (production email)'
      });
      
      // If using Ethereal (test email), log the preview URL
      if (emailResult.previewURL) {
        logger.warn('[REGISTRATION] ⚠️ Using Ethereal test email service. Email will NOT be delivered!', {
          previewURL: emailResult.previewURL,
          message: 'Configure SMTP settings in .env file to send real emails'
        });
        console.log('\n⚠️ WARNING: Using Ethereal test email service!');
        console.log(`📧 Preview URL: ${emailResult.previewURL}`);
        console.log('⚠️ Configure SMTP settings in .env to send real emails\n');
      }
    } catch (emailError) {
      emailErrorDetails = emailError.message;
      logger.error('[REGISTRATION] Failed to send verification email:', {
        error: emailError.message,
        stack: emailError.stack,
        email: email,
        userId: user.id,
        errorCode: emailError.code,
        command: emailError.command,
        response: emailError.response
      });
      console.error('\n❌ [REGISTRATION] Email sending failed:', emailError.message);
      if (emailError.stack) {
        console.error('Stack trace:', emailError.stack);
      }
      // User is already created, but email failed
      // We'll still return success but log the error
    }

    // Return success response
    if (emailSent) {
      logger.info(`Registration completed successfully for ${email}. Activation email sent.`);
      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email inbox and click the activation link to verify your account.',
        data: {
          email: email,
          requiresVerification: true
        }
      });
    } else {
      // Email failed but user was created
      logger.warn(`User ${user.id} created but activation email failed to send`, {
        error: emailErrorDetails,
        email: email
      });
      res.status(201).json({
        success: true,
        message: 'Your account has been created, but we encountered an issue sending the activation email. Please contact support for assistance.',
        warning: 'Email verification required',
        error: process.env.NODE_ENV === 'development' ? emailErrorDetails : undefined,
        data: {
          email: email,
          userId: user.id
        }
      });
    }

  } catch (error) {
    logger.error('Registration error:', {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      logger.warn(`Login failed: User not found for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }
    logger.info(`User found: ${user.email} (ID: ${user.id})`);

    // Check if account is locked
    if (user.isLocked()) {
      logger.warn(`Login failed: Account locked for user: ${email}`);
      return res.status(423).json({
        success: false,
        message: 'Your account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (!user.isActive()) {
      logger.warn(`Login failed: Account not active for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Your account is not active. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      logger.warn(`Login failed: Invalid password for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if email is verified for non-admin users AFTER password is confirmed
    if (user.role !== 'admin' && !user.email_verified) {
      logger.warn(`Login failed: Email not verified for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address to log in. Check your inbox for a verification link.'
      });
    }

    logger.info(`Account is active and not locked for user: ${email}`);

    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    logger.info(`Password verified successfully for user: ${email}`);

    // Generate JWT token
    const token = generateToken(user.id);

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
      email: req.body.email
    });
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify user email (Step 4 & 5: User clicks activation link, Database update)
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Activation token is required'
      });
    }

    logger.info('Email verification attempt with token');

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate token type
    if (decoded.type !== 'email_verification') {
      logger.warn('Invalid token type for email verification');
      return res.status(400).json({
        success: false,
        message: 'Invalid activation token'
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(decoded.email);
    if (!user) {
      logger.warn(`User not found for email: ${decoded.email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid activation token'
      });
    }

    // Check if token matches stored token
    if (user.email_verification_token !== token) {
      logger.warn(`Token mismatch for user: ${user.email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid or already used activation token'
      });
    }

    // Check if already verified
    if (user.email_verified) {
      logger.info(`Email already verified for user: ${user.email}`);
      const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = origin.replace(/\/$/, '');
      return res.redirect(`${frontendUrl}/#/login?verified=true&already=true`);
    }

    // Step 5: Database update - Update user status after verification
    logger.info(`Updating database for email verification: ${user.email}`);
    await user.update({
      email_verified: true,
      email_verification_token: null,
      status: 'active' // Activate the account
    });

    logger.info(`Email verified successfully for user: ${user.email} (ID: ${user.id})`);

    // Get dynamic frontend URL from request origin or fallback to env
    const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

    res.redirect(`${frontendUrl}/#/login?verified=true`);

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid JWT token format');
      return res.status(400).json({
        success: false,
        message: 'Invalid activation token format'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn('Expired activation token');
      return res.status(400).json({
        success: false,
        message: 'Activation token has expired. Please request a new verification email.'
      });
    }

    logger.error('Email verification error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// @route   GET /api/auth/verify-email
// @desc    Verify user email via GET (for email links - Step 4 & 5)
// @access  Public
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    // Get dynamic frontend URL from request origin or fallback to env
    const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

    if (!token) {
      logger.warn('Email verification attempted without token');
      return res.redirect(`${frontendUrl}/#/login?error=no-token`);
    }

    logger.info('Email verification attempt via GET with token');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate token type
    if (decoded.type !== 'email_verification') {
      logger.warn('Invalid token type for email verification');
      return res.redirect(`${frontendUrl}/#/login?error=invalid-token`);
    }
    
    // Find user by email
    const user = await User.findByEmail(decoded.email);
    if (!user) {
      logger.warn(`User not found for email: ${decoded.email}`);
      return res.redirect(`${frontendUrl}/#/login?error=invalid-token`);
    }

    // Check if token matches stored token
    if (user.email_verification_token && user.email_verification_token !== token) {
      logger.warn(`Token mismatch for user: ${user.email}`);
      return res.redirect(`${frontendUrl}/#/login?error=token-mismatch`);
    }

    // Check if already verified
    if (user.email_verified) {
      logger.info(`Email already verified for user: ${user.email}`);
      return res.redirect(`${frontendUrl}/#/login?verified=true&already=true`);
    }

    // Step 5: Database update - Update user status after verification
    logger.info(`Updating database for email verification: ${user.email}`);
    await user.update({
      email_verified: true,
      email_verification_token: null,
      status: 'active' // Activate the account
    });

    logger.info(`Email verified successfully for user: ${user.email} (ID: ${user.id})`);
    res.redirect(`${frontendUrl}/#/login?verified=true`);

  } catch (error) {
    const origin = req.get('origin') || req.get('referer') || process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = origin.replace(/\/$/, '');
    
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid JWT token format');
      return res.redirect(`${frontendUrl}/#/login?error=invalid-token`);
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn('Expired activation token');
      return res.redirect(`${frontendUrl}/#/login?error=expired-token`);
    }

    logger.error('Email verification error:', {
      error: error.message,
      stack: error.stack
    });
    res.redirect(`${frontendUrl}/#/login?error=server-error`);
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', authLimiter, validatePasswordReset, handleValidationErrors, async (req, res) => {
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

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update user with reset token
    await user.update({
      password_reset_token: resetToken,
      password_reset_expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
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
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validatePasswordUpdate, handleValidationErrors, async (req, res) => {
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
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // The `protect` middleware already attached the user object to the request.
    // We just need to send it back.
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', verifyToken, async (req, res) => {
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
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // In a more complex implementation, you might want to blacklist the token
    // For now, we'll just return a success response
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
});

module.exports = router; 