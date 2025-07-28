'use strict';
const { services, serviceDetails } = require('../scripts/servicesDataForSeed');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const servicesToSeed = [];
    for (const categoryKey in services) {
      const category = services[categoryKey];
      for (const item of category.items) {
        const slug = item.href.split('/').pop();
        const details = serviceDetails[slug] || {};
        
        servicesToSeed.push({
          name: item.name,
          slug: slug,
          description: item.desc,
          category: category.name,
          header_image: details.headerImage || null,
          features: JSON.stringify(details.features || []),
          pricing: JSON.stringify(details.pricing || {}),
          sections: JSON.stringify(details.sections || []),
          isPopular: item.popular || false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('services', servicesToSeed, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  }
};
