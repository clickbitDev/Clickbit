const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');
const path = require('path');

// Debug: Log environment variables
logger.info('Database Environment Variables:');
logger.info(`DB_HOST: ${process.env.DB_HOST}`);
logger.info(`DB_PORT: ${process.env.DB_PORT}`);
logger.info(`DB_NAME: ${process.env.DB_NAME}`);
logger.info(`DB_USER: ${process.env.DB_USER}`);
logger.info(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'}`);

// MySQL configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'clickbitdb',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Database connection function with retry logic
const connectDatabase = async (retries = 3, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Using MySQL database`);
      logger.info(`Connection attempt ${attempt} of ${retries}`);
      
      await sequelize.authenticate();
      
      logger.info('Database connection established successfully.');
      
      // Test the connection with a simple query
      await sequelize.query('SELECT 1+1 AS result');
      logger.info('Database connection test successful.');
      
      return sequelize;
    } catch (error) {
      logger.error(`Database connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        logger.error('All database connection attempts failed.');
        throw error;
      }
      
      logger.info(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Export only the sequelize instance and connection function
module.exports = {
  sequelize,
  connectDatabase
}; 