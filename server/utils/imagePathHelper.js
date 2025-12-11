/**
 * Normalizes image paths to ensure they are in the correct format
 * Expected format: /images/uploads/{type}/{filename}
 * 
 * @param {string} path - The image path to normalize
 * @param {string} type - The upload type (portfolio, blog, team)
 * @returns {string|null} - Normalized path or null if invalid
 */
function normalizeImagePath(path, type = 'portfolio') {
  if (!path || typeof path !== 'string') {
    return null;
  }
  
  // If it's already a full URL (external), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's already in the correct format, return as is
  if (path.startsWith('/images/uploads/')) {
    return path;
  }
  
  // Fix: missing leading slash
  if (path.startsWith('images/uploads/')) {
    return '/' + path;
  }
  
  // Fix: missing /images prefix
  if (path.startsWith('/uploads/')) {
    return '/images' + path;
  }
  
  // Fix: missing /images/uploads prefix
  if (path.startsWith('uploads/')) {
    return `/images/${path}`;
  }
  
  // If it's just a filename, construct the full path
  if (!path.includes('/') && path.length > 0) {
    return `/images/uploads/${type}/${path}`;
  }
  
  // If it contains the type but missing /images prefix
  if (path.includes(`/${type}/`) && !path.startsWith('/images/')) {
    return `/images/uploads/${type}/${path.split(`/${type}/`)[1]}`;
  }
  
  // If it's a relative path from public directory
  if (path.startsWith('public/images/')) {
    return '/' + path.replace('public/', '');
  }
  
  // If it's a relative path from client/public
  if (path.includes('client/public/images/')) {
    return '/' + path.split('client/public')[1];
  }
  
  // Return as is if we can't normalize it (might be a valid custom path)
  return path;
}

/**
 * Normalizes an array of image paths (for gallery_images)
 * 
 * @param {Array<string>} paths - Array of image paths
 * @param {string} type - The upload type
 * @returns {Array<string>} - Array of normalized paths
 */
function normalizeImagePaths(paths, type = 'portfolio') {
  if (!Array.isArray(paths)) {
    return [];
  }
  
  return paths
    .map(path => normalizeImagePath(path, type))
    .filter(path => path !== null);
}

/**
 * Normalizes image paths in a portfolio item
 * 
 * @param {Object} item - Portfolio item object
 * @returns {Object} - Portfolio item with normalized paths
 */
function normalizePortfolioItem(item) {
  if (!item) return item;
  
  const normalized = { ...item };
  
  // Normalize featured_image
  if (normalized.featured_image) {
    normalized.featured_image = normalizeImagePath(normalized.featured_image, 'portfolio');
  }
  
  // Normalize gallery_images
  if (normalized.gallery_images) {
    normalized.gallery_images = normalizeImagePaths(normalized.gallery_images, 'portfolio');
  }
  
  // Also normalize cover_image and image_url if they exist
  if (normalized.cover_image) {
    normalized.cover_image = normalizeImagePath(normalized.cover_image, 'portfolio');
  }
  
  if (normalized.image_url) {
    normalized.image_url = normalizeImagePath(normalized.image_url, 'portfolio');
  }
  
  return normalized;
}

/**
 * Normalizes image paths in a blog post
 * 
 * @param {Object} post - Blog post object
 * @returns {Object} - Blog post with normalized paths
 */
function normalizeBlogPost(post) {
  if (!post) return post;
  
  const normalized = { ...post };
  
  // Normalize featured_image
  if (normalized.featured_image) {
    normalized.featured_image = normalizeImagePath(normalized.featured_image, 'blog');
  }
  
  return normalized;
}

module.exports = {
  normalizeImagePath,
  normalizeImagePaths,
  normalizePortfolioItem,
  normalizeBlogPost
};

