const path = require('path');
const fs = require('fs');

class SitemapGenerator {
  constructor() {
    // Use production URL for live domain
    let baseUrl = process.env.FRONTEND_URL || 'https://clickbit.com.au';
    // Ensure baseUrl is properly formatted (remove trailing slash, ensure protocol)
    baseUrl = baseUrl.trim().replace(/\/+$/, ''); // Remove trailing slashes
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`; // Add https if no protocol
    }
    this.baseUrl = baseUrl;
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

      // Try to add portfolio items if database is available
      try {
        const { PortfolioItem } = require('../models');
        const portfolioItems = await PortfolioItem.findAll({
          where: { status: 'published' },
          attributes: ['id', 'title', 'slug', 'updated_at']
        });

        portfolioItems.forEach(item => {
          const lastmod = item.updated_at ? 
            new Date(item.updated_at).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0];
          
          sitemap += `
  <url>
    <loc>${this.baseUrl}/portfolio/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });
      } catch (dbError) {
        console.warn('Could not fetch portfolio items for sitemap:', dbError.message);
      }

      // Try to add blog posts if database is available
      try {
        const { BlogPost } = require('../models');
        const { Op } = require('sequelize');
        const blogPosts = await BlogPost.findAll({
          where: {
            status: 'published',
            published_at: {
              [Op.lte]: new Date()
            }
          },
          attributes: ['id', 'title', 'slug', 'updated_at', 'published_at'],
          order: [['published_at', 'DESC']]
        });

        blogPosts.forEach(post => {
          // Use published_at if available, otherwise updated_at, otherwise today
          const lastmod = post.published_at ? 
            new Date(post.published_at).toISOString().split('T')[0] : 
            (post.updated_at ? 
              new Date(post.updated_at).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0]);
          
          // Ensure full absolute URL for blog post
          const blogUrl = `${this.baseUrl}/blog/${post.slug}`;
          
          sitemap += `
  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
      } catch (dbError) {
        console.warn('Could not fetch blog posts for sitemap:', dbError.message);
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

  async generateBlogSitemap() {
    try {
      // Start XML sitemap
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add blog listing page
      sitemap += `
  <url>
    <loc>${this.baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

      // Try to add blog posts if database is available
      try {
        const { BlogPost } = require('../models');
        const { Op } = require('sequelize');
        const blogPosts = await BlogPost.findAll({
          where: {
            status: 'published',
            published_at: {
              [Op.lte]: new Date()
            }
          },
          attributes: ['id', 'title', 'slug', 'updated_at', 'published_at'],
          order: [['published_at', 'DESC']]
        });

        blogPosts.forEach(post => {
          // Use published_at if available, otherwise updated_at, otherwise today
          const lastmod = post.published_at ? 
            new Date(post.published_at).toISOString().split('T')[0] : 
            (post.updated_at ? 
              new Date(post.updated_at).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0]);
          
          // Ensure full absolute URL for blog post
          const blogUrl = `${this.baseUrl}/blog/${post.slug}`;
          
          sitemap += `
  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
      } catch (dbError) {
        console.warn('Could not fetch blog posts for sitemap:', dbError.message);
      }

      // Close XML sitemap
      sitemap += `
</urlset>`;

      return sitemap;
    } catch (error) {
      console.error('Error generating blog sitemap:', error);
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

  async saveBlogSitemap() {
    try {
      const sitemap = await this.generateBlogSitemap();
      const sitemapPath = path.join(__dirname, '../../client/public/sitemap-blogs.xml');
      
      // Ensure directory exists
      const dir = path.dirname(sitemapPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(sitemapPath, sitemap, 'utf8');
      console.log('Blog sitemap generated successfully at:', sitemapPath);
      return sitemapPath;
    } catch (error) {
      console.error('Error saving blog sitemap:', error);
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