const { PortfolioItem, Service } = require('../models');

// List of search engine user agents
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot', 
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'pinterest',
  'applebot'
];

// Check if request is from a search engine bot
const isBot = (userAgent) => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
};

// Generate SEO-friendly HTML for portfolio page
const generatePortfolioHTML = async () => {
  try {
    const portfolioItems = await PortfolioItem.findAll({
      where: { status: 'published' },
      limit: 12,
      order: [['sort_order', 'ASC'], ['project_date', 'DESC']]
    });

    const portfolioHTML = portfolioItems.map(item => `
      <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 1.5em; margin-bottom: 10px; color: #1f2937;">${item.title}</h3>
        <p style="color: #6b7280; margin-bottom: 10px;"><strong>Category:</strong> ${item.category}</p>
        ${item.short_description ? `<p style="margin-bottom: 10px;">${item.short_description}</p>` : ''}
        ${item.client_name ? `<p style="color: #6b7280; margin-bottom: 10px;"><strong>Client:</strong> ${item.client_name}</p>` : ''}
        ${item.technologies && item.technologies.length > 0 ? `<p style="color: #6b7280;"><strong>Technologies:</strong> ${item.technologies.join(', ')}</p>` : ''}
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Our Portfolio - Web Development Projects | ClickBIT</title>
        <meta name="description" content="Explore ClickBIT's portfolio of successful web development, mobile app, and digital solution projects. See our work for clients across Australia in various industries.">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="https://clickbit.com.au/portfolio">
      </head>
      <body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h1 style="font-size: 2.5em; margin-bottom: 20px; color: #1f2937;">Our Portfolio</h1>
          <p style="font-size: 1.1em; margin-bottom: 30px; color: #6b7280;">
            We take pride in projects powered by our services. Check out our excellent team and the complete portfolio they've crafted, showcasing our expertise and commitment to delivering exceptional results.
          </p>
          
          <div>
            ${portfolioHTML}
          </div>
          
          <div style="margin-top: 40px; text-align: center;">
            <p><strong>Need a custom solution?</strong></p>
            <p>Contact ClickBIT for expert web development, digital marketing, and IT solutions across Australia.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    console.error('Error generating portfolio HTML for bots:', error);
    return null;
  }
};

// Middleware to serve bot-friendly HTML
const botHandler = async (req, res, next) => {
  try {
    const userAgent = req.get('User-Agent') || '';
    
    // Debug: log all requests to see what's happening
    console.log(`Request: ${req.path} | User-Agent: ${userAgent.slice(0, 50)}...`);
    
    // Only handle bots for specific routes
    if (isBot(userAgent)) {
      console.log(`🤖 Bot detected: ${userAgent.slice(0, 50)}... for ${req.path}`);
      
      switch (req.path) {
        case '/portfolio':
          console.log('Generating portfolio HTML for bot...');
          const portfolioHTML = await generatePortfolioHTML();
          if (portfolioHTML) {
            console.log('Serving bot-friendly portfolio HTML');
            return res.send(portfolioHTML);
          }
          break;
          
        case '/':
          // For homepage, continue with React app but log bot visit
          console.log('Bot visiting homepage - serving React app');
          break;
      }
    }
    
    // Continue to normal React app for humans and non-bot requests
    next();
  } catch (error) {
    console.error('Error in bot handler:', error);
    next();
  }
};

module.exports = { botHandler, isBot };
