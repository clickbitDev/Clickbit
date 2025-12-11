const express = require('express');
const router = express.Router();
const { Service } = require('../models');

// GET /api/services - public, all services
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all services...'); // DEBUG LOG
    const services = await Service.findAll({ logging: console.log });
    console.log(`Found ${services.length} services.`); // DEBUG LOG

    // Parse JSON fields for each service
    const parsed = services.map(service => {
      const s = service.toJSON();
      try {
        if (typeof s.features === 'string') s.features = JSON.parse(s.features);
        if (typeof s.pricing === 'string') s.pricing = JSON.parse(s.pricing);
        if (typeof s.sections === 'string') s.sections = JSON.parse(s.sections);
      } catch (e) {
        console.error(`Error parsing JSON for service ${s.id}:`, e); // DEBUG LOG
      }
      return s;
    });
    console.log('Returning parsed services.'); // DEBUG LOG
    res.json(parsed);
  } catch (err) {
    console.error('Error in GET /api/services:', err); // DEBUG LOG
    res.status(500).json({ message: 'Error fetching services', error: err.message });
  }
});

// GET /api/services/by-category - Get services grouped by category
router.get('/by-category', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    
    // Group services by category
    const servicesByCategory = {};
    
    for (const service of services) {
      const s = service.toJSON();
      
      // Parse JSON fields
      if (typeof s.features === 'string') s.features = JSON.parse(s.features);
      if (typeof s.pricing === 'string') s.pricing = JSON.parse(s.pricing);
      if (typeof s.sections === 'string') s.sections = JSON.parse(s.sections);
      
      // Create category if it doesn't exist
      if (!servicesByCategory[s.category]) {
        servicesByCategory[s.category] = {
          name: s.category,
          slug: s.category.toLowerCase().replace(/\s+&\s+/g, '-and-').replace(/\s+/g, '-'),
          items: []
        };
      }
      
      // Add service to category
      servicesByCategory[s.category].items.push({
        name: s.name,
        desc: s.description,
        href: `/services/${s.slug}`,
        slug: s.slug,
        popular: s.isPopular
      });
    }
    
    res.json(servicesByCategory);
  } catch (err) {
    console.error('Error fetching services by category:', err);
    res.status(500).json({ message: 'Error fetching services', error: err.message });
  }
});

// GET /api/services/for-project-form - Get services formatted for Power Your Project form
router.get('/for-project-form', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    
    // Transform services into the format expected by the Power Your Project form
    const formattedServices = {};
    
    for (const service of services) {
      const s = service.toJSON();
      
      // Parse pricing if it's a string
      if (typeof s.pricing === 'string') {
        s.pricing = JSON.parse(s.pricing);
      }
      
      // Create feature categories from pricing tiers
      const featureCategories = [];
      
      if (s.pricing && s.pricing.tiers) {
        // Create a pricing tier category
        featureCategories.push({
          id: 'pricing-tier',
          name: 'Select Package',
          features: s.pricing.tiers.map((tier, index) => ({
            id: `${s.slug}-tier-${index}`,
            name: tier.name,
            description: tier.subtitle || '',
            price: tier.price === 'Custom' ? 0 : parseInt(tier.price.replace(/[^0-9]/g, '')) || 0
          }))
        });
        
        // Create additional features category from tier features
        const additionalFeatures = [];
        s.pricing.tiers.forEach(tier => {
          if (tier.features) {
            tier.features.forEach(feature => {
              // Add unique features as optional add-ons
              if (!additionalFeatures.find(f => f.name === feature)) {
                additionalFeatures.push({
                  id: `${s.slug}-feature-${additionalFeatures.length}`,
                  name: feature,
                  description: 'Optional add-on feature',
                  price: 500 // Default price for add-on features
                });
              }
            });
          }
        });
        
        if (additionalFeatures.length > 0) {
          featureCategories.push({
            id: 'additional-features',
            name: 'Additional Features',
            features: additionalFeatures.slice(0, 5) // Limit to 5 features
          });
        }
      }
      
      // Add to the formatted services object
      formattedServices[s.slug] = {
        id: s.slug,
        name: s.name,
        description: s.description,
        category: s.category,
        featureCategories: featureCategories.length > 0 ? featureCategories : [
          {
            id: 'basic-package',
            name: 'Basic Package',
            features: [{
              id: `${s.slug}-basic`,
              name: s.name,
              description: s.description,
              price: 5000 // Default price
            }]
          }
        ]
      };
    }
    
    res.json(formattedServices);
  } catch (err) {
    console.error('Error fetching services for project form:', err);
    res.status(500).json({ message: 'Error fetching services', error: err.message });
  }
});

// GET /api/services/:slug - public, single service by slug
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ where: { slug: req.params.slug } });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    const s = service.toJSON();
    if (typeof s.features === 'string') s.features = JSON.parse(s.features);
    if (typeof s.pricing === 'string') s.pricing = JSON.parse(s.pricing);
    if (typeof s.sections === 'string') s.sections = JSON.parse(s.sections);
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching service', error: err.message });
  }
});

module.exports = router; 