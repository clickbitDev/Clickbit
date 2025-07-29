const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Import middleware and routes
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');
const { connectDatabase } = require('./config/database');
const { initializeModels } = require('./models');
const connectionMonitor = require('./utils/connectionMonitor');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const { router: paymentRoutes } = require('./routes/payments');
const contentRoutes = require('./routes/content');
const blogRoutes = require('./routes/blog');
const portfolioRoutes = require('./routes/portfolio');
const settingsRoutes = require('./routes/settings');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const servicesRoutes = require('./routes/services');
const teamRoutes = require('./routes/team');
const reviewsRoutes = require('./routes/reviews');
const publicContentRoutes = require('./routes/publicContent');
const uploadRoutes = require('./routes/upload');
const SocketService = require('./services/socketService');

// Import blog scheduler
const blogScheduler = require('./services/blogScheduler');

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Create HTTP server
const httpServer = createServer(app);

// Global server instance for graceful shutdown
let server;

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // In production, only allow specific domains
      if (process.env.NODE_ENV === 'production') {
        const allowedOrigins = [
          'https://clickbit.com.au',
          'https://www.clickbit.com.au',
          'http://clickbit.com.au',
          'http://www.clickbit.com.au'
        ];
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error('Not allowed by CORS'));
        }
      }
      
      // In development, allow localhost and local network IPs
      const localhostRegex = /^http:\/\/localhost:\d+$/;
      const localNetworkRegex = /^http:\/\/192\.168\.\d+\.\d+:\d+$/;
      const localNetworkRegex2 = /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/;
      const localNetworkRegex3 = /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/;
      
      if (localhostRegex.test(origin) || 
          localNetworkRegex.test(origin) || 
          localNetworkRegex2.test(origin) || 
          localNetworkRegex3.test(origin)) {
        return callback(null, true);
      }
      
      // Fallback - allow in development
      return callback(null, true);
    },
    credentials: true,
  },
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://clickbit.com.au", "https://www.clickbit.com.au", "http://clickbit.com.au", "http://www.clickbit.com.au"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://www.google.com", "https://maps.google.com"],
      upgradeInsecureRequests: null, //Disable HTTPS upgrade
    },
  },
}));

// Rate limiting with more lenient settings for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 500 : 1000, // Increased limit for production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: process.env.NODE_ENV !== 'production', // Don't count successful requests in dev
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, only allow specific domains
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://clickbit.com.au',
        'https://www.clickbit.com.au',
        'http://clickbit.com.au',
        'http://www.clickbit.com.au'
      ];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    }
    
    // In development, allow localhost and local network IPs
    const localhostRegex = /^http:\/\/localhost:\d+$/;
    const localNetworkRegex = /^http:\/\/192\.168\.\d+\.\d+:\d+$/;
    const localNetworkRegex2 = /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/;
    const localNetworkRegex3 = /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/;
    
    if (localhostRegex.test(origin) || 
        localNetworkRegex.test(origin) || 
        localNetworkRegex2.test(origin) || 
        localNetworkRegex3.test(origin)) {
      return callback(null, true);
    }
    
    // Fallback - allow in development
    return callback(null, true);
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/public', publicContentRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    const monitorStatus = connectionMonitor.getStatus();
    const isHealthy = monitorStatus.database.healthy;
    
    const response = {
      status: isHealthy ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: monitorStatus.database,
      server: monitorStatus.server
    };
    
    res.status(isHealthy ? 200 : 503).json(response);
  } catch (error) {
    logger.error('Error in health endpoint:', error);
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    });
  }
});

// Sitemap endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    const SitemapGenerator = require('./utils/sitemapGenerator');
    const generator = new SitemapGenerator();
    const sitemap = await generator.generateSitemap();
    
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    logger.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Error handling middleware
app.use(errorHandler);

// Serve React app catch-all in production (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  // 404 handler for development
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl
    });
  });
}

// Function to check if port is already in use
const checkPort = async (port) => {
  const net = require('net');
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close();
        resolve(true);
      })
      .listen(port, '0.0.0.0');
  });
};

// Start server
const startServer = async () => {
  try {
    // Check if port is available
    const portAvailable = await checkPort(PORT);
    if (!portAvailable) {
      logger.error(`Port ${PORT} is already in use!`);
      logger.info('Please kill the existing process or use a different port.');
      logger.info(`Run: lsof -ti:${PORT} | xargs kill -9`);
      process.exit(1);
    }

    // Connect to database
    logger.info('Attempting to connect to the database...');
    await connectDatabase();
    logger.info('Database connected successfully');

    // Initialize models and associations
    logger.info('Initializing models...');
    await initializeModels();
    logger.info('Models initialized successfully');

    // Start listening
    server = httpServer.listen(PORT, () => {
      logger.info(`🚀 Clickbit.com.au server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
      logger.info(`Process ID: ${process.pid}`);
      logger.info(`Socket.IO server initialized`);
    });

    // Initialize Socket Service
    const socketService = new SocketService(io);
    app.set('socketService', socketService);

    // Set keep-alive timeout
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds
    
    // Initialize connection monitor with sequelize instance
    const { sequelize } = require('./config/database');
    connectionMonitor.setSequelize(sequelize);
    
    // Start connection monitoring
    connectionMonitor.startMonitoring(30000); // Check every 30 seconds
    
    // Start blog scheduler
    blogScheduler.start();
    logger.info('Blog scheduler started');
    
    // Generate sitemap
    try {
      const { generateSitemap } = require('./scripts/generateSitemap');
      await generateSitemap();
    } catch (sitemapError) {
      logger.warn('Failed to generate sitemap:', sitemapError);
    }
    
  } catch (error) {
    logger.error('Failed to start server:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      original: error.original,
    });
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  // Stop accepting new connections
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
    });
  }
  
  try {
    // Stop connection monitoring
    connectionMonitor.stopMonitoring();
    
    // Stop blog scheduler
    blogScheduler.stop();
    logger.info('Blog scheduler stopped');
    
    // Close database connection
    const { sequelize } = require('./config/database');
    await sequelize.close();
    logger.info('Database connection closed');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', err);
  // Don't exit immediately in development
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('unhandledRejection');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  logger.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
  // Don't exit immediately in development
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('uncaughtException');
  }
});

startServer();

module.exports = app; 
