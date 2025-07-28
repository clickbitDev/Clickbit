const path = require('path');

// Load static service data from the backend JS file
const { services: servicesByCategory, serviceDetails } = require('../scripts/servicesDataForSeed.js');

// Flatten services and merge with details
const allServices = [];
for (const categoryKey in servicesByCategory) {
  const category = servicesByCategory[categoryKey];
  for (const item of category.items) {
    const slug = item.href.replace('/services/', '');
    const detail = serviceDetails[slug] || {};
    allServices.push({
      name: item.name,
      slug,
      description: item.desc || detail.title || '',
      category: category.name,
      headerImage: detail.headerImage || null,
      features: detail.sections ? detail.sections.map(s => s.title) : null,
      pricing: detail.pricing ? JSON.stringify(detail.pricing) : null,
      sections: detail.sections ? JSON.stringify(detail.sections) : null,
      isPopular: !!item.popular,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const firstRow = allServices[0];
    const testRow = {
      name: firstRow.name,
      slug: firstRow.slug,
      description: firstRow.description,
      category: firstRow.category,
      headerImage: firstRow.headerImage,
      features: firstRow.features ? JSON.stringify(firstRow.features) : null,
      isPopular: firstRow.isPopular,
      isActive: firstRow.isActive,
      createdAt: firstRow.createdAt,
      updatedAt: firstRow.updatedAt
    };
    console.log('Test row:', testRow);
    await queryInterface.bulkInsert(
      'services',
      [testRow],
      {
        fields: [
          'name', 'slug', 'description', 'category', 'headerImage',
          'features', 'isPopular', 'isActive', 'createdAt', 'updatedAt'
        ]
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
  },
}; 