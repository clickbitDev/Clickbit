const { logger } = require('../utils/logger');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Security middleware for enhanced protection
class SecurityMiddleware {
  constructor() {
    this.blacklistedTokens = new Set();
    this.failedAttempts = new Map();
    this.maxFailedAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
  }

  // Token blacklisting for secure logout
  blacklistToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        // Only blacklist if token hasn't expired
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp > now) {
          this.blacklistedTokens.add(token);
          logger.info('Token blacklisted for secure logout', { 
            userId: decoded.id,
            exp: decoded.exp 
          });
        }
      }
    } catch (error) {
      logger.error('Error blacklisting token:', error);
    }
  }

  // Check if token is blacklisted
  isTokenBlacklisted(token) {
    return this.blacklistedTokens.has(token);
  }

  // Clean expired tokens from blacklist
  cleanBlacklist() {
    const now = Math.floor(Date.now() / 1000);
    for (const token of this.blacklistedTokens) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp < now) {
          this.blacklistedTokens.delete(token);
        }
      } catch (error) {
        this.blacklistedTokens.delete(token);
      }
    }
  }

  // Enhanced JWT verification with blacklist check
  verifyTokenWithBlacklist(req, res, next) {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No valid token provided'
        });
      }

      const token = authHeader.substring(7);
      
      // Check if token is blacklisted
      if (this.isTokenBlacklisted(token)) {
        return res.status(401).json({
          success: false,
          message: 'Token has been invalidated'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'clickbit.com.au',
        audience: 'clickbit-users'
      });

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

      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  // Rate limiting with IP tracking
  rateLimitByIP(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!this.failedAttempts.has(ip)) {
      this.failedAttempts.set(ip, { count: 0, lastAttempt: now });
    }

    const attempts = this.failedAttempts.get(ip);
    
    // Reset count if enough time has passed
    if (now - attempts.lastAttempt > this.lockoutDuration) {
      attempts.count = 0;
    }

    // Check if IP is locked out
    if (attempts.count >= this.maxFailedAttempts && 
        now - attempts.lastAttempt < this.lockoutDuration) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please try again later.',
        retryAfter: Math.ceil((this.lockoutDuration - (now - attempts.lastAttempt)) / 1000)
      });
    }

    req.rateLimitInfo = attempts;
    next();
  }

  // Increment failed attempts
  incrementFailedAttempts(req) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!this.failedAttempts.has(ip)) {
      this.failedAttempts.set(ip, { count: 0, lastAttempt: now });
    }

    const attempts = this.failedAttempts.get(ip);
    attempts.count++;
    attempts.lastAttempt = now;

    logger.warn('Failed authentication attempt', {
      ip,
      count: attempts.count,
      userAgent: req.get('User-Agent')
    });
  }

  // Reset failed attempts on successful login
  resetFailedAttempts(req) {
    const ip = req.ip || req.connection.remoteAddress;
    this.failedAttempts.delete(ip);
  }

  // SQL injection prevention
  sanitizeSQLInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove or escape dangerous SQL characters
    return input
      .replace(/['"\\]/g, '') // Remove quotes and backslashes
      .replace(/[;--]/g, '') // Remove semicolons and comments
      .replace(/union/gi, '') // Remove UNION keywords
      .replace(/select/gi, '') // Remove SELECT keywords
      .replace(/insert/gi, '') // Remove INSERT keywords
      .replace(/update/gi, '') // Remove UPDATE keywords
      .replace(/delete/gi, '') // Remove DELETE keywords
      .replace(/drop/gi, '') // Remove DROP keywords
      .trim();
  }

  // XSS prevention
  sanitizeHTML(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // CSRF protection
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Verify CSRF token
  verifyCSRFToken(req, res, next) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!token || !sessionToken || token !== sessionToken) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token validation failed'
      });
    }

    next();
  }

  // Security headers middleware
  securityHeaders(req, res, next) {
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // HSTS in production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
  }

  // Request logging for security monitoring
  securityLogging(req, res, next) {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      // Log security-relevant requests
      if (req.path.includes('/auth/') || req.path.includes('/admin/') || 
          res.statusCode >= 400) {
        logger.info('Security event', {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: req.user?.id || null
        });
      }
    });

    next();
  }

  // File upload security
  validateFileUpload(req, res, next) {
    if (!req.file) return next();

    const file = req.file;
    
    // Check file size
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }

    // Check MIME type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images are allowed.'
      });
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file extension.'
      });
    }

    next();
  }

  // Clean up expired data periodically
  startCleanup() {
    setInterval(() => {
      this.cleanBlacklist();
      
      // Clean old failed attempts
      const now = Date.now();
      for (const [ip, attempts] of this.failedAttempts) {
        if (now - attempts.lastAttempt > this.lockoutDuration * 2) {
          this.failedAttempts.delete(ip);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}

// Create singleton instance
const securityMiddleware = new SecurityMiddleware();

// Start cleanup process
securityMiddleware.startCleanup();

module.exports = securityMiddleware;


