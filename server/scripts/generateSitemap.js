// Load environment variables
require('dotenv').config();

const SitemapGenerator = require('../utils/sitemapGenerator');
const { connectDatabase } = require('../config/database');

async function generateSitemap() {
  try {
    console.log('🗺️  Generating sitemaps...');
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connected');
    
    // Note: We don't need to initialize models/associations for sitemap generation
    // The models are already loaded and we only need simple findAll() queries
    
    // Generate main sitemap
    const generator = new SitemapGenerator();
    console.log('\n📄 Generating main sitemap...');
    await generator.saveSitemap();
    console.log('✅ Main sitemap generated successfully');
    
    // Generate blog sitemap
    console.log('\n📝 Generating blog sitemap...');
    await generator.saveBlogSitemap();
    console.log('✅ Blog sitemap generated successfully');
    
    console.log('\n🎉 All sitemaps generated successfully!');
    
    // Only exit if running as standalone script, not when called from server
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    // Only exit if running as standalone script
    if (require.main === module) {
      process.exit(1);
    }
    throw error; // Re-throw so server can handle it
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };