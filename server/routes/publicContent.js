const express = require('express');
const router = express.Router();
const { Content, SiteSetting, BlogPost, PortfolioItem, Service, Contact, Order, User, Team } = require('../models');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const jwt = require('jsonwebtoken');

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      if (process.env.NODE_ENV === 'development') {
        console.log('OptionalAuth: User authenticated:', req.user?.email, 'Role:', req.user?.role);
      }
    } catch (error) {
      // Ignore auth errors - continue without user
      if (process.env.NODE_ENV === 'development') {
        console.log('OptionalAuth: Token verification failed (continuing without auth):', error.message);
      }
      req.user = null;
    }
  } else {
    req.user = null;
  }
  
  next();
};

// @desc    Get site identity (public)
// @route   GET /api/public/site-identity
// @access  Public
router.get('/site-identity', async (req, res) => {
  try {
    let siteIdentity = await Content.findOne({ 
      where: { 
        slug: 'site-identity',
        content_type: 'custom'
      } 
    });

    if (!siteIdentity) {
      // Return default site identity if it doesn't exist
      const defaultSiteIdentity = {
        siteTitle: 'ClickBit - Web Solutions',
        metaDescription: 'ClickBit - Custom Web & Software Solutions',
        faviconUrl: '/favicon.ico'
      };
      return res.json(defaultSiteIdentity);
    }

    const siteData = JSON.parse(siteIdentity.content);
    res.json(siteData);
  } catch (error) {
    console.error('Error fetching public site identity:', error);
    // Return default data on error to ensure website functionality
    res.json({
      siteTitle: 'ClickBit - Web Solutions',
      metaDescription: 'ClickBit - Custom Web & Software Solutions',
      faviconUrl: '/favicon.ico'
    });
  }
});

// @desc    Get contact information (public)
// @route   GET /api/public/contact-info
// @access  Public
router.get('/contact-info', async (req, res) => {
  try {
    let contactInfo = await Content.findOne({ 
      where: { 
        slug: 'contact-info',
        content_type: 'custom'
      } 
    });

    if (!contactInfo) {
      // Return default contact info if it doesn't exist
      const defaultContactInfo = {
        phone1: '+61 2 7229 9577',
        phone2: '+61 422 512 130',
        email: 'info@clickbit.com.au',
        address: '44 Shoreline Road\nMoorebank NSW 2170\nAustralia',
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nWeekend: By appointment',
        googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.643330663454!2d150.9133093152115!3d-33.9249269806403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b1295a3c9a35e7d%3A0x8f4f4c9c1c4f2e5a!2s44%20Shoreline%20Rd%2C%20Moorebank%20NSW%202170%2C%20Australia!5e0!3m2!1sen!2sau!4v1620211993456!5m2!1sen!2sus',
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.clickbit.com.au' },
          { platform: 'instagram', url: 'https://instagram.clickbit.com.au' },
          { platform: 'linkedin', url: 'https://linkedin.clickbit.com.au' },
          { platform: 'twitter', url: 'https://x.clickbit.com.au' },
          { platform: 'tiktok', url: 'https://tiktok.clickbit.com.au' },
          { platform: 'youtube', url: 'https://youtube.clickbit.com.au' },
          { platform: 'github', url: 'https://github.clickbit.com.au' }
        ]
      };
      return res.json(defaultContactInfo);
    }

    const contactData = JSON.parse(contactInfo.content);
    res.json(contactData);
  } catch (error) {
    console.error('Error fetching public contact info:', error);
    // Return default data on error to ensure website functionality
    res.json({
      phone1: '+61 2 7229 9577',
      phone2: '+61 422 512 130',
      email: 'info@clickbit.com.au',
      address: '44 Shoreline Road\nMoorebank NSW 2170\nAustralia',
      businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nWeekend: By appointment',
              googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.643330663454!2d150.9133093152115!3d-33.9249269806403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b1295a3c9a35e7d%3A0x8f4f4c9c1c4f2e5a!2s44%20Shoreline%20Rd%2C%20Moorebank%20NSW%202170%2C%20Australia!5e0!3m2!1sen!2sau!4v1620211993456!5m2!1sen!2sus',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.clickbit.com.au' },
        { platform: 'instagram', url: 'https://instagram.clickbit.com.au' },
        { platform: 'linkedin', url: 'https://linkedin.clickbit.com.au' },
        { platform: 'twitter', url: 'https://x.clickbit.com.au' },
        { platform: 'tiktok', url: 'https://tiktok.clickbit.com.au' },
        { platform: 'youtube', url: 'https://youtube.clickbit.com.au' },
        { platform: 'github', url: 'https://github.clickbit.com.au' }
      ]
    });
  }
});

// @desc    Get footer content (public)
// @route   GET /api/public/footer-content
// @access  Public
router.get('/footer-content', async (req, res) => {
  try {
    let footerContent = await Content.findOne({ 
      where: { 
        slug: 'footer-content',
        content_type: 'custom'
      } 
    });

    if (!footerContent) {
      // Return default footer content if it doesn't exist
      const defaultFooterContent = {
        companyDescription: 'Empowering businesses with innovative digital solutions to connect, engage, and grow.'
      };
      return res.json(defaultFooterContent);
    }

    const footerData = JSON.parse(footerContent.content);
    res.json(footerData);
  } catch (error) {
    console.error('Error fetching public footer content:', error);
    // Return default data on error to ensure website functionality
    res.json({
      companyDescription: 'Empowering businesses with innovative digital solutions to connect, engage, and grow.'
    });
  }
});

// @desc    Get navigation (public)
// @route   GET /api/public/navigation
// @access  Public
router.get('/navigation', async (req, res) => {
  try {
    let navigation = await Content.findOne({ 
      where: { 
        slug: 'navigation-main',
        content_type: 'custom'
      } 
    });

    if (!navigation) {
      // Return default navigation if it doesn't exist
      const defaultNavigation = [
        { label: 'About', path: '/about', order: 1 },
        { label: 'Services', path: '/services', order: 2, hasDropdown: true },
        { label: 'Portfolio', path: '/portfolio', order: 3 },
        { label: 'Contact', path: '/contact', order: 4 }
      ];
      return res.json(defaultNavigation);
    }

    const navData = JSON.parse(navigation.content);
    res.json(navData);
  } catch (error) {
    console.error('Error fetching public navigation:', error);
    // Return default data on error to ensure website functionality
    res.json([
      { label: 'About', path: '/about', order: 1 },
      { label: 'Services', path: '/services', order: 2, hasDropdown: true },
      { label: 'Portfolio', path: '/portfolio', order: 3 },
      { label: 'Contact', path: '/contact', order: 4 }
    ]);
  }
});

// @desc    Get FAQ items (public)
// @route   GET /api/public/faq
// @access  Public
router.get('/faq', async (req, res) => {
  try {
    let faqContent = await Content.findOne({ 
      where: { 
        slug: 'faq-items',
        content_type: 'custom'
      } 
    });

    if (!faqContent) {
      // Return default FAQ content if it doesn't exist
      const defaultFAQs = [
        {
          question: "What services does ClickBit offer?",
          answer: "ClickBit offers comprehensive digital solutions including Custom Web Applications, Website Development, Mobile App Development, Infrastructure Services (Cloud Solutions, Network Design, Data Storage), Specialized Tech (AI/ML, Data Analytics), Business Systems (CRM, ERP, HRM, SCM), Design & Branding, Marketing & Growth services, and Business Packages (Startup, Small Business, Ultimate).",
          category: "General"
        },
        {
          question: "How long does it take to build a website or application?",
          answer: "Timelines vary by project complexity: Simple business websites (2-4 weeks), complex web applications (8-12 weeks), mobile apps (10-16 weeks), and enterprise solutions (12-20 weeks). We provide detailed timelines during consultation based on your specific requirements.",
          category: "General"
        },
        {
          question: "Do you provide ongoing support after project completion?",
          answer: "Yes, we offer comprehensive support packages including website maintenance, security updates, performance monitoring, content updates, and technical support. We provide 30 days of free support after project completion, with ongoing maintenance packages starting from $99/month.",
          category: "General"
        }
      ];
      return res.json(defaultFAQs);
    }

    const faqData = JSON.parse(faqContent.content);
    res.json(faqData);
  } catch (error) {
    console.error('Error fetching public FAQ data:', error);
    // Return default data on error
    res.json([
      {
        question: "What services does ClickBit offer?",
        answer: "ClickBit offers comprehensive digital solutions including Custom Web Applications, Website Development, Mobile App Development, Infrastructure Services, Specialized Tech, Business Systems, Design & Branding, and Marketing & Growth services.",
        category: "General"
      }
    ]);
  }
});

// @desc    Get mission points (public)
// @route   GET /api/public/mission-points
// @access  Public
router.get('/mission-points', async (req, res) => {
  try {
    let missionContent = await Content.findOne({ 
      where: { 
        slug: 'mission-points',
        content_type: 'custom'
      } 
    });

    if (!missionContent) {
      // Return default mission points if they don't exist
      const defaultMissionPoints = [
        {
          icon: 'Users',
          title: 'Customer Centric',
          description: 'Personalized services that cater to your specific needs, ensuring that our solutions fit your business perfectly.'
        },
        {
          icon: 'Handshake',
          title: 'Collaborative Partnership',
          description: 'We work alongside you, maintaining open communication to fully understand your vision and incorporate your feedback into our strategies.'
        },
        {
          icon: 'Gem',
          title: 'Commitment to Quality',
          description: 'Our expert team stays updated on industry trends, delivering innovative solutions with a strong focus on quality.'
        },
        {
          icon: 'Target',
          title: 'Achieving Goals Together',
          description: 'We measure our success by your results. Your achievements are milestones for us, and we celebrate every step forward together.'
        }
      ];
      return res.json(defaultMissionPoints);
    }

    const missionData = JSON.parse(missionContent.content);
    res.json(missionData);
  } catch (error) {
    console.error('Error fetching public mission points:', error);
    // Return default data on error
    res.json([
      {
        icon: 'Users',
        title: 'Customer Centric',
        description: 'Personalized services that cater to your specific needs, ensuring that our solutions fit your business perfectly.'
      }
    ]);
  }
});

// @desc    Get marketing integrations (public)
// @route   GET /api/public/marketing-integrations
// @access  Public
router.get('/marketing-integrations', async (req, res) => {
  try {
    // Use the same data source as admin panel (SiteSetting table)
    let marketingSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'marketing_integrations'
      } 
    });

    if (!marketingSetting) {
      // Return default marketing integrations if they don't exist
      const defaultMarketingIntegrations = {
        headerScripts: '',
        googleSearchConsoleTag: '',
        googleAnalyticsId: '',
        facebookPixelId: '',
        customMetaTags: ''
      };
      return res.json(defaultMarketingIntegrations);
    }

    const marketingData = JSON.parse(marketingSetting.setting_value);
    res.json(marketingData);
  } catch (error) {
    console.error('Error fetching public marketing integrations:', error);
    // Return default data on error
    res.json({
      headerScripts: '',
      googleSearchConsoleTag: '',
      googleAnalyticsId: '',
      facebookPixelId: '',
      customMetaTags: ''
    });
  }
});

// @desc    Get process phases (public)
// @route   GET /api/public/process-phases
// @access  Public
router.get('/process-phases', async (req, res) => {
  try {
    let processContent = await Content.findOne({ 
      where: { 
        slug: 'process-phases',
        content_type: 'custom'
      } 
    });

    if (!processContent) {
      // Return default process phases if they don't exist
      const defaultProcessPhases = [
        {
          id: 1,
          mainIcon: 'ClipboardList',
          title: 'Planning',
          subtitle: '& Requirements',
          description: 'We define the project\'s scope, goals, and foundational needs, aligning expectations for a clear roadmap ahead.',
          color: 'text-[#1FBBD2]',
          bgColor: 'hover:bg-cyan-50',
          darkBgColor: 'dark:hover:bg-cyan-900/20',
          deliverables: [
            { text: 'Detailed Project Scope Document', icon: 'FileText' },
            { text: 'Stakeholder Register', icon: 'Users' },
            { text: 'User & Technical Requirements', icon: 'ClipboardCheck' },
            { text: 'Draft Project Plan & Schedule', icon: 'Calendar' }
          ]
        },
        {
          id: 2,
          mainIcon: 'Palette',
          title: 'Design',
          subtitle: '& Development',
          description: 'Transforming concepts into functional realities, we craft user-centric designs and build robust, scalable solutions.',
          color: 'text-[#F39C12]',
          bgColor: 'hover:bg-amber-50',
          darkBgColor: 'dark:hover:bg-amber-900/20',
          deliverables: [
            { text: 'System Architecture Design', icon: 'Network' },
            { text: 'UI/UX Mockups & Prototypes', icon: 'Layout' },
            { text: 'Alpha Version of Modules/Components', icon: 'Code' },
            { text: 'Unit Test Cases', icon: 'TestTube' }
          ]
        }
      ];
      return res.json(defaultProcessPhases);
    }

    const processData = JSON.parse(processContent.content);
    res.json(processData);
  } catch (error) {
    console.error('Error fetching public process phases:', error);
    // Return default data on error
    res.json([
      {
        id: 1,
        mainIcon: 'ClipboardList',
        title: 'Planning',
        subtitle: '& Requirements',
        description: 'We define the project\'s scope, goals, and foundational needs, aligning expectations for a clear roadmap ahead.',
        color: 'text-[#1FBBD2]',
        bgColor: 'hover:bg-cyan-50',
        darkBgColor: 'dark:hover:bg-cyan-900/20',
        deliverables: [
          { text: 'Detailed Project Scope Document', icon: 'FileText' }
        ]
      }
    ]);
  }
});

// @desc    Comprehensive search across all content types
// @route   GET /api/public/search
// @access  Public (with admin enhancements if authenticated)
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({
        services: [],
        blogPosts: [],
        portfolioItems: [],
        pages: [],
        teamMembers: [],
        contacts: [],
        orders: [],
        users: [],
        total: 0
      });
    }

    const searchQuery = q.trim();
    const searchPattern = `%${searchQuery}%`;
    const limitNum = parseInt(limit);
    
    // Check if user is authenticated and has admin/manager role
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'manager');
    
    // Debug logging (can be removed later)
    if (process.env.NODE_ENV === 'development') {
      console.log('Search query:', searchQuery);
      console.log('User authenticated:', !!req.user);
      console.log('User role:', req.user?.role);
      console.log('Is admin:', isAdmin);
    }

    // Search services (case-insensitive for MySQL)
    // Search in name, description, and JSON fields (features, sections)
    // For JSON fields, we'll search by casting to text and using LIKE
    const services = await Service.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.like]: searchPattern } },
          { description: { [Op.like]: searchPattern } },
          // Search in JSON fields by casting to text
          sequelize.literal(`CAST(features AS CHAR) LIKE ${sequelize.escape(searchPattern)}`),
          sequelize.literal(`CAST(sections AS CHAR) LIKE ${sequelize.escape(searchPattern)}`),
          sequelize.literal(`CAST(pricing AS CHAR) LIKE ${sequelize.escape(searchPattern)}`)
        ]
      },
      limit: limitNum,
      attributes: ['id', 'name', 'slug', 'description', 'category']
    });

    // Search blog posts (case-insensitive for MySQL)
    // If admin, include unpublished posts
    const blogPostWhere = {
        [Op.or]: [
          { title: { [Op.like]: searchPattern } },
          { excerpt: { [Op.like]: searchPattern } },
          { content: { [Op.like]: searchPattern } }
        ]
      };
    
    if (!isAdmin) {
      blogPostWhere.status = 'published';
      blogPostWhere.published_at = {
        [Op.lte]: new Date()
      };
    }
    
    const blogPosts = await BlogPost.findAll({
      where: blogPostWhere,
      limit: limitNum,
      attributes: ['id', 'title', 'slug', 'excerpt', 'published_at', 'status']
    });

    // Search portfolio items (case-insensitive for MySQL)
    // If admin, include unpublished items
    const portfolioWhere = {
        [Op.or]: [
          { title: { [Op.like]: searchPattern } },
          { description: { [Op.like]: searchPattern } },
          { client_name: { [Op.like]: searchPattern } }
        ]
      };
    
    if (!isAdmin) {
      portfolioWhere.status = 'published';
    }
    
    const portfolioItems = await PortfolioItem.findAll({
      where: portfolioWhere,
      limit: limitNum,
      attributes: ['id', 'title', 'slug', 'description', 'client_name', 'project_date', 'status']
    });

    // Search all content types (pages, custom content, etc.)
    // If admin, include unpublished content
    const contentWhere = {
        [Op.or]: [
          { title: { [Op.like]: searchPattern } },
          { excerpt: { [Op.like]: searchPattern } },
          { content: { [Op.like]: searchPattern } },
          { meta_description: { [Op.like]: searchPattern } },
          { meta_keywords: { [Op.like]: searchPattern } }
        ]
      };
    
    if (!isAdmin) {
      contentWhere.status = 'published';
    }
    
    const pages = await Content.findAll({
      where: contentWhere,
      limit: limitNum,
      attributes: ['id', 'title', 'slug', 'excerpt', 'content_type', 'status', 'content']
    });

    // Search team members
    const teamMembers = await Team.findAll({
      where: {
        is_active: true,
        [Op.or]: [
          { name: { [Op.like]: searchPattern } },
          { role: { [Op.like]: searchPattern } },
          { role_label: { [Op.like]: searchPattern } },
          { bio: { [Op.like]: searchPattern } },
          { email: { [Op.like]: searchPattern } }
        ]
      },
      limit: limitNum,
      attributes: ['id', 'name', 'role', 'role_label', 'email', 'bio', 'image']
    });

    // Admin-only searches
    let contacts = [];
    let orders = [];
    let users = [];

    if (isAdmin) {
      // Search contacts (admin panel)
      contacts = await Contact.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: searchPattern } },
            { email: { [Op.like]: searchPattern } },
            { subject: { [Op.like]: searchPattern } },
            { message: { [Op.like]: searchPattern } }
          ]
        },
        limit: limitNum,
        attributes: ['id', 'name', 'email', 'subject', 'contact_type', 'status', 'created_at']
      });

      // Search orders (admin panel)
      orders = await Order.findAll({
        where: {
          [Op.or]: [
            { order_number: { [Op.like]: searchPattern } },
            { guest_email: { [Op.like]: searchPattern } }
          ]
        },
        limit: limitNum,
        attributes: ['id', 'order_number', 'guest_email', 'status', 'total_amount', 'created_at']
      });

      // Search users (admin panel) - search full name combinations too
      // Use raw query to search full name combinations efficiently
      const [userResults] = await sequelize.query(`
        SELECT id, first_name, last_name, email, role, created_at
        FROM users
        WHERE first_name LIKE :pattern
           OR last_name LIKE :pattern
           OR email LIKE :pattern
           OR CONCAT(first_name, ' ', last_name) LIKE :pattern
        LIMIT :limit
      `, {
        replacements: {
          pattern: searchPattern,
          limit: limitNum
        },
        type: QueryTypes.SELECT
      });
      
      // Convert raw results to User instances
      users = userResults.map((row) => ({
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        role: row.role,
        created_at: row.created_at
      }));
    }

    // Admin navigation items (static - always available for admin searches)
    const adminNavItems = isAdmin ? [
      { label: 'Dashboard', path: '/admin/dashboard', keywords: ['dashboard', 'admin', 'home'] },
      { label: 'Orders', path: '/admin/orders', keywords: ['orders', 'order', 'sales', 'purchases'] },
      { label: 'Blog', path: '/admin/blog', keywords: ['blog', 'posts', 'articles', 'content'] },
      { label: 'Portfolio', path: '/admin/portfolio', keywords: ['portfolio', 'projects', 'work'] },
      { label: 'Services', path: '/admin/services', keywords: ['services', 'service', 'products'] },
      { label: 'Reviews', path: '/admin/reviews', keywords: ['reviews', 'review', 'testimonials'] },
      { label: 'Team', path: '/admin/team', keywords: ['team', 'members', 'staff'] },
      { label: 'Contacts', path: '/admin/contacts', keywords: ['contacts', 'contact', 'leads', 'inquiries'] },
      { label: 'Users', path: '/admin/users', keywords: ['users', 'user', 'accounts', 'people'] },
      { label: 'Analytics', path: '/admin/analytics', keywords: ['analytics', 'stats', 'statistics', 'data'] },
      { label: 'Marketing', path: '/admin/marketing', keywords: ['marketing', 'seo', 'advertising'] },
      { label: 'Billing', path: '/admin/billing', keywords: ['billing', 'payment', 'invoice', 'subscription'] },
      { label: 'Uptime Kuma', path: '/admin/uptime-kuma', keywords: ['uptime', 'kuma', 'monitoring', 'status', 'system monitor'] },
      { label: 'External Services', path: '/admin/external-services', keywords: ['external', 'services', 'crm', 'tools'] }
    ] : [];

    // Filter admin nav items based on search query
    const matchingAdminNavItems = adminNavItems.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return item.label.toLowerCase().includes(searchLower) ||
             item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
    });

    // Format results
    const formattedServices = services.map(service => ({
      type: 'service',
      id: service.id,
      name: service.name,
      description: service.description,
      href: `/services/${service.slug}`,
      category: service.category
    }));

    const formattedBlogPosts = blogPosts.map(post => ({
      type: 'blog',
      id: post.id,
      name: post.title,
      description: post.excerpt,
      href: `/blog/${post.slug}`,
      published_at: post.published_at
    }));

    const formattedPortfolioItems = portfolioItems.map(item => ({
      type: 'portfolio',
      id: item.id,
      name: item.title,
      description: item.description,
      href: `/portfolio/${item.slug}`,
      client: item.client_name
    }));

    const formattedPages = pages.map(page => {
      // Determine the correct href based on content type and slug
      let href = `/${page.slug}`;
      if (page.content_type === 'custom') {
        // For custom content, try to map to known pages
        if (page.slug === 'about' || page.slug.includes('about')) {
          href = '/about';
        }
      }
      
      return {
        type: page.content_type === 'page' ? 'page' : 'content',
        id: page.id,
        name: page.title,
        description: page.excerpt || (page.content ? page.content.substring(0, 150) + '...' : ''),
        href: href,
        status: page.status,
        content_type: page.content_type
      };
    });

    const formattedTeamMembers = teamMembers.map(member => ({
      type: 'team',
      id: member.id,
      name: member.name,
      description: member.role + (member.bio ? ` - ${member.bio.substring(0, 100)}` : ''),
      href: '/about',
      role: member.role,
      email: member.email
    }));

    // Format admin results
    const formattedContacts = contacts.map(contact => ({
      type: 'contact',
      id: contact.id,
      name: contact.name || contact.email,
      description: contact.subject,
      href: `/admin/contacts`,
      email: contact.email,
      status: contact.status,
      contact_type: contact.contact_type
    }));

    const formattedOrders = orders.map(order => ({
      type: 'order',
      id: order.id,
      name: `Order ${order.order_number}`,
      description: order.guest_email || `Total: $${order.total_amount}`,
      href: `/admin/orders`,
      order_number: order.order_number,
      status: order.status
    }));

    const formattedUsers = users.map(user => ({
      type: 'user',
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      description: user.email,
      href: `/admin/users`,
      email: user.email,
      role: user.role
    }));

    const formattedAdminNavItems = matchingAdminNavItems.map(item => ({
      type: 'admin',
      id: `nav-${item.path}`,
      name: item.label,
      description: `Admin panel: ${item.label}`,
      href: item.path
    }));

    // Combine all results
    const allResults = [
      ...formattedServices,
      ...formattedBlogPosts,
      ...formattedPortfolioItems,
      ...formattedPages,
      ...formattedTeamMembers,
      ...formattedAdminNavItems,
      ...formattedContacts,
      ...formattedOrders,
      ...formattedUsers
    ];

    res.json({
      services: formattedServices,
      blogPosts: formattedBlogPosts,
      portfolioItems: formattedPortfolioItems,
      pages: formattedPages,
      teamMembers: formattedTeamMembers,
      adminNav: formattedAdminNavItems,
      contacts: formattedContacts,
      orders: formattedOrders,
      users: formattedUsers,
      all: allResults,
      total: allResults.length,
      isAdmin: isAdmin || false
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ 
      message: 'Error performing search', 
      error: error.message,
      services: [],
      blogPosts: [],
      portfolioItems: [],
      pages: [],
      teamMembers: [],
      contacts: [],
      orders: [],
      users: [],
      all: [],
      total: 0,
      isAdmin: false
    });
  }
});

module.exports = router;