const productMapping = require('./client/src/services/service-product-mapping.json');

console.log('Testing product mapping...');

// Test the exact values we expect
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

// Test the exact function logic
function getProductByServiceAndTier(serviceSlug, tierName) {
  const product = productMapping.products.find(p => 
    p.serviceSlug === serviceSlug && p.tierName === tierName
  );
  return product || null;
}

function createCartItemData(serviceSlug, tierName) {
  const product = getProductByServiceAndTier(serviceSlug, tierName);
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
    serviceName: 'Website Development', // Hardcoded for test
    price: product.price,
    description: `${product.name} - ${product.tierName}`
  };
}

console.log('\nTesting createCartItemData...');
const cartItemData = createCartItemData(serviceSlug, tierName);
console.log('Cart item data:', cartItemData); 