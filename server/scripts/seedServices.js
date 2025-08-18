const { sequelize } = require('../config/database');
const Service = require('../models/Service');
const { services: servicesByCategory, serviceDetails } = require('./servicesDataForSeed');

const seedServices = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    console.log('Clearing existing services...');
    await Service.destroy({ where: {} });

    const allServices = [];
    
    // Process all service categories
    for (const categoryKey in servicesByCategory) {
      const category = servicesByCategory[categoryKey];
      
      for (const item of category.items) {
        const slug = item.href.replace('/services/', '');
        const detail = serviceDetails[slug] || {};
        
        const service = {
          name: item.name,
          slug: slug,
          description: item.desc || detail.title || '',
          category: category.name,
          headerImage: detail.headerImage || null,
          features: detail.sections ? detail.sections.map(s => ({ title: s.title, type: s.type })) : [],
          pricing: detail.pricing || null,
          sections: detail.sections || [],
          isPopular: !!item.popular,
          isActive: true,
        };
        
        allServices.push(service);
      }
    }

    console.log(`Seeding ${allServices.length} services...`);
    
    for (const service of allServices) {
      await Service.create(service);
      console.log(`Created service: ${service.name} (${service.slug})`);
    }

    console.log('\nServices seeded successfully!');
    
    // Show summary
    const totalServices = await Service.count();
    const popularServices = await Service.count({ where: { isPopular: true } });
    const categories = await Service.findAll({
      attributes: ['category'],
      group: ['category']
    });
    
    console.log(`\nSummary:`);
    console.log(`- Total services: ${totalServices}`);
    console.log(`- Popular services: ${popularServices}`);
    console.log(`- Categories: ${categories.map(c => c.category).join(', ')}`);

  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await sequelize.close();
  }
};

seedServices();