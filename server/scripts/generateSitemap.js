const SitemapGenerator = require('../utils/sitemapGenerator');

async function generateSitemap() {
  try {
    console.log('🗺️  Generating sitemap...');
    const generator = new SitemapGenerator();
    await generator.saveSitemap();
    console.log('✅ Sitemap generated successfully');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };