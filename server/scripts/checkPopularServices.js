const { Service } = require('../models');
const { logger } = require('../utils/logger');

const checkPopularServices = async () => {
  try {
    logger.info('Checking popular services in database...');

    // Get all services
    const allServices = await Service.findAll({
      attributes: ['id', 'name', 'slug', 'isPopular', 'category']
    });

    logger.info(`Total services found: ${allServices.length}`);

    // Check popular services
    const popularServices = allServices.filter(s => s.isPopular);
    logger.info(`Popular services found: ${popularServices.length}`);

    if (popularServices.length > 0) {
      logger.info('Popular services:');
      popularServices.forEach(service => {
        logger.info(`- ${service.name} (${service.slug}) - Category: ${service.category}`);
      });
    } else {
      logger.info('No services are marked as popular!');
      
      // Show all services for reference
      logger.info('All services:');
      allServices.forEach(service => {
        logger.info(`- ${service.name} (${service.slug}) - Popular: ${service.isPopular} - Category: ${service.category}`);
      });
    }

  } catch (error) {
    logger.error('Error checking popular services:', error);
    throw error;
  }
};

// Run the check if this script is executed directly
if (require.main === module) {
  const { connectDatabase } = require('../config/database');
  
  connectDatabase()
    .then(() => {
      logger.info('Database connected, checking popular services...');
      return checkPopularServices();
    })
    .then(() => {
      logger.info('Popular services check completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Popular services check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkPopularServices }; 