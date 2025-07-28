const path = require('path');
const fs = require('fs');

class SitemapGenerator {
  constructor() {
    this.baseUrl = process.env.FRONTEND_URL || 'https://clickbit.com.au';
    this.staticRoutes = [
      { path: '/', priority: 1.0, changefreq: 'weekly' },
      { path: '/about', priority: 0.8, changefreq: 'monthly' },
      { path: '/services', priority: 0.9, changefreq: 'weekly' },
      { path: '/portfolio', priority: 0.8, changefreq: 'weekly' },
      { path: '/contact', priority: 0.7, changefreq: 'monthly' },
      { path: '/blog', priority: 0.8, changefreq: 'daily' },
      { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
      { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
      { path: '/faq', priority: 0.6, changefreq: 'monthly' },
      { path: '/power-your-project', priority: 0.7, changefreq: 'monthly' }
    ];
  }

  async generateSitemap() {
    try {
      // Start XML sitemap
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static routes
      this.staticRoutes.forEach(route => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
      });

      // Try to add service detail pages if database is available
      try {
        const { Service } = require('../models');
        const services = await Service.findAll({
          where: { is_active: true },
          attributes: ['id', 'name', 'slug', 'updated_at']
        });

        services.forEach(service => {
          const lastmod = service.updated_at ? 
            new Date(service.updated_at).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0];
          
          sitemap += `
  <url>
    <loc>${this.baseUrl}/services/${service.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
      } catch (dbError) {
        console.warn('Could not fetch services for sitemap, using static routes only:', dbError.message);
      }

      // Close XML sitemap
      sitemap += `
</urlset>`;

      return sitemap;
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  }

  async saveSitemap() {
    try {
      const sitemap = await this.generateSitemap();
      const sitemapPath = path.join(__dirname, '../../client/public/sitemap.xml');
      
      // Ensure directory exists
      const dir = path.dirname(sitemapPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(sitemapPath, sitemap, 'utf8');
      console.log('Sitemap generated successfully at:', sitemapPath);
      return sitemapPath;
    } catch (error) {
      console.error('Error saving sitemap:', error);
      throw error;
    }
  }

  // Generate structured data for rich snippets
  generateStructuredData() {
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ClickBit",
      "description": "Custom Web & Software Solutions",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.svg`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+61-2-7229-9577",
        "contactType": "Customer Service",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "44 Shoreline Road",
        "addressLocality": "Moorebank",
        "addressRegion": "NSW",
        "postalCode": "2170",
        "addressCountry": "AU"
      },
      "sameAs": [
        "https://www.facebook.com/clickbitau/",
        "https://www.instagram.com/clickbitau/",
        "https://www.linkedin.com/company/clickbitau/"
      ]
    };

    return organizationData;
  }
}

module.exports = SitemapGenerator;