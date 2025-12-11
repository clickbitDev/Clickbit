const { logger } = require('../utils/logger');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
    details = err.errors;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Database Validation Error';
    details = err.errors?.map(e => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    status = 503;
    message = 'Database connection error. Please try again later.';
  } else if (err.name === 'SequelizeTimeoutError' || err.name === 'SequelizeConnectionTimedOutError') {
    status = 504;
    message = 'Database request timed out. Please try again.';
  } else if (err.code === 'ECONNREFUSED') {
    status = 503;
    message = 'Service temporarily unavailable. Please try again later.';
  } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
    status = 504;
    message = 'Request timed out. Please check your connection and try again.';
  } else if (err.code === 'ENOTFOUND') {
    status = 503;
    message = 'Service not found. Please check your configuration.';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal Server Error';
    details = null;
  } else if (process.env.NODE_ENV === 'development') {
    // Include stack trace in development
    details = {
      ...details,
      stack: err.stack,
      original: err
    };
  }

  // Send error response
  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    }
  });
};

// 404 handler for unmatched routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error handler
const validationErrorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      error: 'Malformed JSON in request body'
    });
  }
  next(err);
};

// CORS error handler
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Request not allowed from this origin'
    });
  }
  next(err);
};

// Database connection error handler
const databaseErrorHandler = (err, req, res, next) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    logger.error('Database connection error:', err);
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Service temporarily unavailable'
    });
  }
  next(err);
};

// Memory leak detection
const memoryLeakHandler = (req, res, next) => {
  const used = process.memoryUsage();
  
  // Log memory usage if it's getting high
  if (used.heapUsed > 500 * 1024 * 1024) { // 500MB
    logger.warn('High memory usage detected:', {
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`,
      url: req.url,
      method: req.method
    });
  }
  
  next();
};

// Request timeout handler
const timeoutHandler = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      logger.error('Request timeout:', {
        url: req.url,
        method: req.method,
        timeout: timeout
      });
      
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: 'Request timeout',
          error: 'Request took too long to process'
        });
      }
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    next();
  };
};

// Security error handler
const securityErrorHandler = (err, req, res, next) => {
  // Handle security-related errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed',
      error: 'Invalid or missing CSRF token'
    });
  }
  
  if (err.code === 'ETIMEDOUT') {
    return res.status(408).json({
      success: false,
      message: 'Request timeout',
      error: 'Connection timed out'
    });
  }
  
  next(err);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  validationErrorHandler,
  corsErrorHandler,
  databaseErrorHandler,
  memoryLeakHandler,
  timeoutHandler,
  securityErrorHandler
}; 