const { logger } = require('./logger');

class ConnectionMonitor {
  constructor() {
    this.isHealthy = true;
    this.lastCheck = new Date();
    this.checkInterval = null;
    this.failureCount = 0;
    this.maxFailures = 3;
    this.sequelize = null; // Will be set later
  }

  setSequelize(sequelize) {
    this.sequelize = sequelize;
  }

  async checkDatabaseConnection() {
    if (!this.sequelize) {
      logger.warn('ConnectionMonitor: Sequelize not initialized');
      return false;
    }

    try {
      await this.sequelize.query('SELECT 1+1 AS result', { 
        timeout: 5000,
        type: this.sequelize.QueryTypes.SELECT 
      });
      
      if (!this.isHealthy) {
        logger.info('Database connection restored');
      }
      
      this.isHealthy = true;
      this.failureCount = 0;
      this.lastCheck = new Date();
      
      return true;
    } catch (error) {
      this.failureCount++;
      
      logger.error(`Database health check failed (${this.failureCount}/${this.maxFailures}):`, {
        error: error.message,
        failureCount: this.failureCount
      });
      
      if (this.failureCount >= this.maxFailures) {
        this.isHealthy = false;
        logger.error('Database connection marked as unhealthy');
      }
      
      this.lastCheck = new Date();
      return false;
    }
  }

  startMonitoring(intervalMs = 30000) {
    logger.info(`Starting connection monitoring (interval: ${intervalMs}ms)`);
    
    // Initial check
    this.checkDatabaseConnection();
    
    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkDatabaseConnection();
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Connection monitoring stopped');
    }
  }

  getStatus() {
    return {
      database: {
        healthy: this.isHealthy,
        lastCheck: this.lastCheck,
        failureCount: this.failureCount,
        uptime: this.isHealthy ? new Date() - this.lastCheck : 0
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
      }
    };
  }

  async handleConnectionError(error) {
    logger.error('Connection error detected:', {
      error: error.message,
      code: error.code,
      name: error.name
    });

    if (!this.sequelize) {
      logger.warn('ConnectionMonitor: Cannot handle connection error - Sequelize not initialized');
      return false;
    }

    // Attempt to reconnect
    if (error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED') {
      logger.info('Attempting to reconnect to database...');
      
      try {
        await this.sequelize.close();
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        await this.sequelize.authenticate();
        
        logger.info('Successfully reconnected to database');
        this.isHealthy = true;
        this.failureCount = 0;
        
        return true;
      } catch (reconnectError) {
        logger.error('Failed to reconnect:', reconnectError.message);
        return false;
      }
    }
    
    return false;
  }
}

// Export singleton instance
module.exports = new ConnectionMonitor();