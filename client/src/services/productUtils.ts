import productMapping from './service-product-mapping.json';

export interface ProductInfo {
  id: number;
  name: string;
  slug: string;
  price: number;
  serviceSlug: string;
  tierName: string;
}

export interface CartItemData {
  productId: number;
  name: string;
  serviceSlug: string;
  serviceName: string;
  price: number;
  description: string;
}

/**
 * Get product information by service slug and tier name
 */
export const getProductByServiceAndTier = (serviceSlug: string, tierName: string): ProductInfo | null => {
  console.log('getProductByServiceAndTier called with:', { serviceSlug, tierName });
  console.log('Available products:', productMapping.products.length);
  
  const product = productMapping.products.find(p => 
    p.serviceSlug === serviceSlug && p.tierName === tierName
  );
  
  console.log('Found product:', product);
  return product || null;
};

/**
 * Get product information by product ID
 */
export const getProductById = (productId: number): ProductInfo | null => {
  const product = productMapping.products.find(p => p.id === productId);
  return product || null;
};

/**
 * Create cart item data from service slug and tier name
 */
export const createCartItemData = (serviceSlug: string, tierName: string): CartItemData | null => {
  console.log('createCartItemData called with:', { serviceSlug, tierName });
  
  const product = getProductByServiceAndTier(serviceSlug, tierName);
  console.log('getProductByServiceAndTier result:', product);
  
  if (!product) {
    console.error('No product found for:', { serviceSlug, tierName });
    return null;
  }

  // Get service name from the mapping
  const serviceMapping = (productMapping.serviceToProductMapping as any)[serviceSlug];
  console.log('serviceMapping:', serviceMapping);
  
  if (!serviceMapping) {
    console.error('No service mapping found for:', serviceSlug);
    return null;
  }

  const result = {
    productId: product.id,
    name: product.name,
    serviceSlug: product.serviceSlug,
    serviceName: getServiceNameFromSlug(serviceSlug),
    price: product.price,
    description: `${product.name} - ${product.tierName}`
  };
  
  console.log('createCartItemData returning:', result);
  return result;
};

/**
 * Create cart item data from product ID
 */
export const createCartItemDataFromProductId = (productId: number): CartItemData | null => {
  const product = getProductById(productId);
  if (!product) return null;

  return {
    productId: product.id,
    name: product.name,
    serviceSlug: product.serviceSlug,
    serviceName: getServiceNameFromSlug(product.serviceSlug),
    price: product.price,
    description: `${product.name} - ${product.tierName}`
  };
};

/**
 * Get service name from service slug
 */
const getServiceNameFromSlug = (serviceSlug: string): string => {
  const serviceNameMap: Record<string, string> = {
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
}; 