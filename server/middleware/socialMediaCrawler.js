const path = require('path');
const fs = require('fs');
const { Content, PortfolioItem, BlogPost } = require('../models');

// List of known social media crawler user agents
const socialMediaCrawlers = [
  'facebookexternalhit',
  'facebookcatalog',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'slackbot',
  'discordbot',
  'skypeuripreview',
  'microsoft preview',
  'googlebot',
  'bingbot',
  'yandexbot',
  'baiduspider',
  'duckduckbot',
  'applebot',
  'crawler',
  'spider',
  'bot',
  'got', // HTTP client used by many crawlers
  'curl',
  'wget',
  'python-requests',
  'node-fetch',
  'axios'
];

// Function to detect if the request is from a social media crawler
const isSocialMediaCrawler = (userAgent) => {
  if (!userAgent) return false;
  
  const lowerUserAgent = userAgent.toLowerCase();
  return socialMediaCrawlers.some(crawler => lowerUserAgent.includes(crawler));
};

// Function to generate meta tags for a given URL
const generateMetaTags = async (url) => {
  let metaData = {
    title: 'ClickBIT - Web Development, Digital Marketing & IT Solutions Australia',
    description: 'Leading web development, digital marketing & IT solutions in Australia. Custom software, mobile apps, cloud solutions & comprehensive IT support for startups and small businesses.',
    image: 'https://clickbit.com.au/images/logos/logo-full.png',
    url: `https://clickbit.com.au${url}`,
    type: 'website'
  };

  // Handle root and common pages
  if (url === '/' || url === '') {
    metaData = {
      title: 'ClickBIT Home',
      description: 'Empowering businesses with innovative digital solutions to connect, engage, and grow. Expert web development, custom applications, and IT support services.',
      image: 'https://clickbit.com.au/images/logos/logo-full.png',
      url: 'https://clickbit.com.au/',
      type: 'website'
    };
  } else if (url === '/about') {
    metaData = {
      title: 'About Us',
      description: 'Meet the ClickBit team - passionate experts delivering customized IT solutions. Learn about our mission to empower businesses with innovative digital strategies.',
      image: 'https://clickbit.com.au/images/logos/logo-full.png',
      url: 'https://clickbit.com.au/about',
      type: 'website'
    };
  } else if (url === '/contact') {
    metaData = {
      title: 'Contact Us',
      description: 'Get in touch with ClickBit\'s expert team. Ready to start your project? Contact us for professional web development, software solutions, and IT services.',
      image: 'https://clickbit.com.au/images/logos/logo-full.png',
      url: 'https://clickbit.com.au/contact',
      type: 'website'
    };
  } else if (url === '/portfolio') {
    metaData = {
      title: 'Our Portfolio - Web Development Projects | ClickBIT',
      description: 'Explore ClickBIT\'s portfolio of successful web development, mobile app, and digital solution projects. See our work for clients across Australia.',
      image: 'https://clickbit.com.au/images/logos/logo-full.png',
      url: 'https://clickbit.com.au/portfolio',
      type: 'website'
    };
  } else if (url === '/services') {
    metaData = {
      title: 'Our Services',
      description: 'Comprehensive web development, digital marketing, and IT solutions. Custom software, mobile apps, cloud solutions, and IT support across Australia.',
      image: 'https://clickbit.com.au/images/logos/logo-full.png',
      url: 'https://clickbit.com.au/services',
      type: 'website'
    };
  } else if (url === '/blog') {
    metaData = {
      title: 'Blog - Web Development Insights & Tips | ClickBIT',
      description: 'Stay updated with the latest web development trends, digital marketing insights, and IT solutions from the ClickBIT team.',
      image: 'https://clickbit.com.au/images/logos/logo-full.png',
      url: 'https://clickbit.com.au/blog',
      type: 'website'
    };
  }

  try {
    // Handle blog posts
    if (url.startsWith('/blog/')) {
      const slug = url.replace('/blog/', '');
      console.log('Looking up blog post with slug:', slug);
      
      // Try BlogPost model first (main blog posts)
      let post = await BlogPost.findOne({
        where: {
          slug: slug,
          status: 'published'
        }
      });
      
      // If not found, try Content model (legacy content)
      if (!post) {
        post = await Content.findOne({
          where: {
            slug: slug,
            content_type: 'post',
            status: 'published'
          }
        });
      }

      console.log('Found blog post:', post ? post.title : 'Not found');

      if (post) {
        metaData = {
          title: `${post.title} | ClickBIT`,
          description: post.excerpt || `${post.title} - Read the latest insights and updates from the ClickBit team.`,
          image: post.featured_image ? 
            (post.featured_image.startsWith('http') ? post.featured_image : `https://clickbit.com.au${post.featured_image}`) :
            'https://clickbit.com.au/images/logos/logo-full.png',
          url: `https://clickbit.com.au/blog/${slug}`,
          type: 'article'
        };
      }
    }

    // Handle portfolio items
    if (url.startsWith('/portfolio/')) {
      const slug = url.replace('/portfolio/', '');
      console.log('Looking up portfolio item with slug:', slug);
      
      const item = await PortfolioItem.findOne({
        where: {
          slug: slug,
          status: 'published'
        }
      });

      console.log('Found portfolio item:', item ? item.title : 'Not found');

      if (item) {
        metaData = {
          title: `${item.title} | ClickBIT Portfolio`,
          description: item.description || `${item.title} - A portfolio project by ClickBIT showcasing ${item.category} development.`,
          image: item.featured_image ? 
            (item.featured_image.startsWith('http') ? item.featured_image : `https://clickbit.com.au${item.featured_image}`) :
            'https://clickbit.com.au/images/logos/logo-full.png',
          url: `https://clickbit.com.au/portfolio/${slug}`,
          type: 'article'
        };
      }
    }

    // Handle services
    if (url.startsWith('/services/')) {
      const slug = url.replace('/services/', '');
      metaData = {
        title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Services | ClickBIT`,
        description: `Professional ${slug.replace(/-/g, ' ')} services by ClickBit. Custom solutions tailored to your business needs.`,
        image: 'https://clickbit.com.au/images/logos/logo-full.png',
        url: `https://clickbit.com.au/services/${slug}`,
        type: 'website'
      };
    }
  } catch (error) {
    console.error('Error generating meta tags:', error);
    // Use fallback meta tags for unknown routes
    return generateFallbackMetaTags(url);
  }

  // If no specific meta data was generated, use fallback
  if (!metaData || metaData.title === 'ClickBIT - Web Development, Digital Marketing & IT Solutions Australia') {
    return generateFallbackMetaTags(url);
  }

  return metaData;
};

// Function to generate fallback meta tags for unknown routes
const generateFallbackMetaTags = (url) => {
  // Extract meaningful parts from the URL
  const pathSegments = url.split('/').filter(segment => segment && segment !== '');
  const lastSegment = pathSegments[pathSegments.length - 1] || 'page';
  
  // Convert slug to readable title
  const titleFromSlug = lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Generate contextual descriptions based on path
  let contextualDescription = 'Professional web development and digital marketing solutions by ClickBIT.';
  
  if (pathSegments.includes('blog')) {
    contextualDescription = `Read our latest insights on ${titleFromSlug.toLowerCase()}. Expert web development, digital marketing, and IT solutions from ClickBIT.`;
  } else if (pathSegments.includes('portfolio')) {
    contextualDescription = `Explore our ${titleFromSlug.toLowerCase()} project. See how ClickBIT delivers exceptional web development and digital solutions.`;
  } else if (pathSegments.includes('services')) {
    contextualDescription = `Professional ${titleFromSlug.toLowerCase()} services by ClickBIT. Custom solutions tailored to your business needs.`;
  } else if (pathSegments.includes('case-study')) {
    contextualDescription = `Case study: ${titleFromSlug}. Learn how ClickBIT solved complex challenges with innovative web development solutions.`;
  } else if (pathSegments.includes('team')) {
    contextualDescription = `Meet our ${titleFromSlug.toLowerCase()} team members. Expert developers, designers, and digital marketing specialists at ClickBIT.`;
  } else if (pathSegments.includes('careers') || pathSegments.includes('jobs')) {
    contextualDescription = `Join our team at ClickBIT. ${titleFromSlug} opportunities in web development, digital marketing, and IT solutions.`;
  } else if (pathSegments.includes('pricing')) {
    contextualDescription = `Transparent pricing for ${titleFromSlug.toLowerCase()} services. Get the best value for your web development and digital marketing needs.`;
  } else if (pathSegments.includes('contact')) {
    contextualDescription = `Get in touch with ClickBIT for ${titleFromSlug.toLowerCase()} inquiries. Free consultation for web development and digital marketing projects.`;
  } else if (pathSegments.includes('about')) {
    contextualDescription = `Learn about ClickBIT's ${titleFromSlug.toLowerCase()}. Leading web development, digital marketing, and IT solutions in Australia.`;
  } else if (pathSegments.includes('faq')) {
    contextualDescription = `Frequently asked questions about ${titleFromSlug.toLowerCase()}. Get answers about ClickBIT's web development and digital marketing services.`;
  } else if (pathSegments.includes('privacy') || pathSegments.includes('terms')) {
    contextualDescription = `${titleFromSlug} - ClickBIT's commitment to privacy and terms of service for our web development and digital marketing clients.`;
  } else if (pathSegments.includes('sitemap')) {
    contextualDescription = `Sitemap for ClickBIT's website. Find all our web development, digital marketing, and IT solution pages easily.`;
  } else if (pathSegments.includes('search')) {
    contextualDescription = `Search results for ${titleFromSlug.toLowerCase()}. Find relevant web development and digital marketing content on ClickBIT.`;
  } else if (pathSegments.length > 0) {
    // Generic fallback for any other dynamic route
    contextualDescription = `Explore ${titleFromSlug.toLowerCase()} with ClickBIT. Professional web development, digital marketing, and IT solutions across Australia.`;
  }

  return {
    title: `${titleFromSlug} | ClickBIT`,
    description: contextualDescription,
    image: 'https://clickbit.com.au/images/logos/logo-full.png',
    url: `https://clickbit.com.au${url}`,
    type: 'website'
  };
};

// Function to generate structured data (JSON-LD)
const generateStructuredData = (metaData, url) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ClickBIT",
    "url": "https://clickbit.com.au",
    "logo": "https://clickbit.com.au/images/logos/logo-full.png",
    "description": "Leading web development, digital marketing & IT solutions in Australia",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU"
    },
    "sameAs": [
      "https://linkedin.clickbit.com.au",
      "https://x.clickbit.com.au"
    ]
  };

  // Add specific structured data based on content type
  if (url.startsWith('/blog/')) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": metaData.title.replace(' | ClickBIT', ''),
      "description": metaData.description,
      "image": metaData.image,
      "url": metaData.url,
      "author": {
        "@type": "Organization",
        "name": "ClickBIT"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ClickBIT",
        "logo": {
          "@type": "ImageObject",
          "url": "https://clickbit.com.au/images/logos/logo-full.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  } else if (url.startsWith('/portfolio/')) {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": metaData.title.replace(' | ClickBIT Portfolio', ''),
      "description": metaData.description,
      "image": metaData.image,
      "url": metaData.url,
      "creator": {
        "@type": "Organization",
        "name": "ClickBIT"
      }
    };
  } else if (url.startsWith('/services/')) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": metaData.title.replace(' Services | ClickBIT', ''),
      "description": metaData.description,
      "provider": {
        "@type": "Organization",
        "name": "ClickBIT",
        "url": "https://clickbit.com.au"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Australia"
      }
    };
  }

  return baseStructuredData;
};

// Function to inject meta tags into HTML
const injectMetaTags = (html, metaData, url) => {
  // Escape HTML characters in meta data
  const escapeHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const metaTags = `
    <meta property="og:title" content="${escapeHtml(metaData.title)}" />
    <meta property="og:description" content="${escapeHtml(metaData.description)}" />
    <meta property="og:image" content="${escapeHtml(metaData.image)}" />
    <meta property="og:url" content="${escapeHtml(metaData.url)}" />
    <meta property="og:type" content="${escapeHtml(metaData.type)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(metaData.title)}" />
    <meta property="og:site_name" content="ClickBIT" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metaData.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metaData.description)}" />
    <meta name="twitter:image" content="${escapeHtml(metaData.image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(metaData.title)}" />
    <meta name="twitter:site" content="@clickbitau" />
    
    <title>${escapeHtml(metaData.title)}</title>
    <meta name="description" content="${escapeHtml(metaData.description)}" />
    <link rel="canonical" href="${escapeHtml(metaData.url)}" />
    <meta name="robots" content="index, follow" />
  `;

  // Generate structured data
  const structuredData = generateStructuredData(metaData, url);
  const jsonLdScript = `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  `;

  const allTags = metaTags + jsonLdScript;

  // Try to replace existing meta tags, fallback to inserting before closing head tag
  const existingMetaPattern = /<meta property="og:title"[^>]*>[\s\S]*?<link rel="canonical"[^>]*>/;
  if (existingMetaPattern.test(html)) {
    return html.replace(existingMetaPattern, allTags);
  } else {
    // Fallback: insert before closing head tag
    return html.replace('</head>', `${allTags}\n  </head>`);
  }
};

// Middleware function
const socialMediaCrawlerMiddleware = async (req, res, next) => {
  // Only process GET requests for HTML pages
  if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.startsWith('/static/')) {
    return next();
  }

  const userAgent = req.get('User-Agent') || '';
  const isCrawler = isSocialMediaCrawler(userAgent);
  
  console.log('Social Media Crawler Check:', {
    path: req.path,
    userAgent: userAgent.slice(0, 100),
    isCrawler: isCrawler
  });

  // For blog, portfolio, and main pages, always try to serve custom meta tags
  // This ensures social media crawlers get the right content even if user agent detection fails
  const shouldProcess = isCrawler || 
    req.path.startsWith('/blog/') || 
    req.path.startsWith('/portfolio/') ||
    req.path.startsWith('/services/') ||
    ['/', '/about', '/contact', '/portfolio', '/services', '/blog'].includes(req.path);
  
  if (!shouldProcess) {
    return next();
  }

  try {
    console.log('Processing social media crawler request for:', req.path);
    
    // Generate meta tags for the current URL
    const metaData = await generateMetaTags(req.path);
    console.log('Generated meta data:', metaData);
    
    // Check if index.html exists
    const indexPath = path.join(__dirname, '../../client/build/index.html');
    if (!fs.existsSync(indexPath)) {
      console.warn('index.html not found, falling back to normal behavior');
      return next();
    }
    
    // Read the index.html file
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Inject the correct meta tags
    html = injectMetaTags(html, metaData, req.path);
    console.log('Meta tags and structured data injected successfully');
    
    // Set appropriate headers
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'X-Meta-Injected': 'true'
    });
    
    // Send the modified HTML
    res.send(html);
  } catch (error) {
    console.error('Error in social media crawler middleware:', error);
    next(); // Fall back to normal behavior
  }
};

module.exports = { socialMediaCrawlerMiddleware, isSocialMediaCrawler };
