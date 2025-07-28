const productMapping = require('./client/src/services/service-product-mapping.json');

// Test the product mapping
console.log('Testing product mapping...');

// Test web-dev service with Starter tier
const serviceSlug = 'web-dev';
const tierName = 'Starter';

console.log('Service Slug:', serviceSlug);
console.log('Tier Name:', tierName);

// Check if the mapping exists
const serviceMapping = productMapping.serviceToProductMapping[serviceSlug];
console.log('Service mapping exists:', !!serviceMapping);

if (serviceMapping) {
  console.log('Available tiers for web-dev:', Object.keys(serviceMapping));
  console.log('Starter tier exists:', !!serviceMapping[tierName]);
  
  if (serviceMapping[tierName]) {
    console.log('Starter tier data:', serviceMapping[tierName]);
  }
}

// Check products array
const product = productMapping.products.find(
  p => p.serviceSlug === serviceSlug && p.tierName === tierName
);

console.log('Product found:', !!product);
if (product) {
  console.log('Product data:', product);
}

// Test createCartItemData function logic
function createCartItemData(serviceSlug, tierName) {
  const product = productMapping.products.find(p => 
    p.serviceSlug === serviceSlug && p.tierName === tierName
  );
  
  if (!product) {
    console.log('No product found for', serviceSlug, tierName);
    return null;
  }

  const serviceMapping = productMapping.serviceToProductMapping[serviceSlug];
  if (!serviceMapping) {
    console.log('No service mapping found for', serviceSlug);
    return null;
  }

  return {
    productId: product.id,
    name: product.name,
    serviceSlug: product.serviceSlug,
    serviceName: getServiceNameFromSlug(product.serviceSlug),
    price: product.price,
    description: `${product.name} - ${product.tierName}`
  };
}

function getServiceNameFromSlug(serviceSlug) {
  const serviceNameMap = {
    'web-dev': 'Website Development',
    'graphic-design': 'Graphic Design',
    'branding': 'Branding & Identity',
    'printing': 'Printing Services',
    'data-storage': 'Data Storage Solutions',
    'support': 'Maintenance & Support',
    'email-hosting': 'Professional Email Hosting',
    'digital-marketing': 'Strategic Digital Marketing',
    'custom-apps': 'Custom Applications',
    'mobile-apps': 'Mobile Applications',
    'ecommerce': 'E-commerce Solutions',
    'seo': 'Search Engine Optimization',
    'social-media': 'Social Media Management',
    'content-creation': 'Content Creation',
    'video-production': 'Video Production',
    'photography': 'Photography Services',
    'ui-ux-design': 'UI/UX Design',
    'consulting': 'IT Consulting',
    'cloud-services': 'Cloud Services',
    'cybersecurity': 'Cybersecurity Services'
  };
  
  return serviceNameMap[serviceSlug] || serviceSlug;
}

console.log('\nTesting createCartItemData...');
const cartItemData = createCartItemData(serviceSlug, tierName);
console.log('Cart item data:', cartItemData); 