const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  exitOnError: false
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Add custom methods for structured logging
logger.logAPI = (level, message, meta = {}) => {
  logger.log(level, message, {
    service: 'clickbit-api',
    timestamp: new Date().toISOString(),
    ...meta
  });
};

logger.logAuth = (level, message, meta = {}) => {
  logger.log(level, message, {
    service: 'clickbit-auth',
    timestamp: new Date().toISOString(),
    ...meta
  });
};

logger.logPayment = (level, message, meta = {}) => {
  logger.log(level, message, {
    service: 'clickbit-payment',
    timestamp: new Date().toISOString(),
    ...meta
  });
};

logger.logEmail = (level, message, meta = {}) => {
  logger.log(level, message, {
    service: 'clickbit-email',
    timestamp: new Date().toISOString(),
    ...meta
  });
};

logger.logDatabase = (level, message, meta = {}) => {
  logger.log(level, message, {
    service: 'clickbit-database',
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Performance logging
logger.logPerformance = (operation, duration, meta = {}) => {
  const level = duration > 1000 ? 'warn' : 'info';
  logger.log(level, `Performance: ${operation} took ${duration}ms`, {
    service: 'clickbit-performance',
    operation,
    duration,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Security logging
logger.logSecurity = (level, message, meta = {}) => {
  logger.log(level, message, {
    service: 'clickbit-security',
    timestamp: new Date().toISOString(),
    ip: meta.ip || 'unknown',
    userAgent: meta.userAgent || 'unknown',
    userId: meta.userId || 'anonymous',
    ...meta
  });
};

// Error logging with stack trace
logger.logError = (error, meta = {}) => {
  logger.error(error.message, {
    service: 'clickbit-error',
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Request logging
logger.logRequest = (req, res, duration) => {
  const meta = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  };

  const level = res.statusCode >= 400 ? 'warn' : 'info';
  logger.log(level, `${req.method} ${req.url} - ${res.statusCode}`, {
    service: 'clickbit-request',
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Database query logging
logger.logQuery = (sql, duration, meta = {}) => {
  const level = duration > 100 ? 'warn' : 'debug';
  logger.log(level, `Database query: ${sql}`, {
    service: 'clickbit-database',
    sql,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Email logging
logger.logEmailSent = (to, subject, success, meta = {}) => {
  const level = success ? 'info' : 'error';
  logger.log(level, `Email ${success ? 'sent' : 'failed'}: ${subject} to ${to}`, {
    service: 'clickbit-email',
    to,
    subject,
    success,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Payment logging
logger.logPayment = (amount, currency, status, meta = {}) => {
  const level = status === 'succeeded' ? 'info' : 'error';
  logger.log(level, `Payment ${status}: ${amount} ${currency}`, {
    service: 'clickbit-payment',
    amount,
    currency,
    status,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// User activity logging
logger.logUserActivity = (userId, action, meta = {}) => {
  logger.info(`User activity: ${action}`, {
    service: 'clickbit-user-activity',
    userId,
    action,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Export the logger
module.exports = { logger }; 