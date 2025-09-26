const express = require('express');
const router = express.Router();
const { Content, SiteSetting } = require('../models');

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

module.exports = router;