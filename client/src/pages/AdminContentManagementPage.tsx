import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Save, Upload, Eye, Edit2, Image as ImageIcon, Type, Globe, Plus, Trash2, HelpCircle, Target, Zap, Settings, Phone, Navigation, FileText } from 'lucide-react';

interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'rich_text';
  section: string;
  key: string;
  label: string;
  value: string;
  description?: string;
  page: string;
}

interface ContentPage {
  name: string;
  sections: ContentSection[];
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface MissionPoint {
  icon: string;
  title: string;
  description: string;
}

interface ProcessPhase {
  id: number;
  mainIcon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  deliverables: Array<{
    text: string;
    icon: string;
  }>;
}

interface SiteIdentity {
  siteTitle: string;
  metaDescription: string;
  faviconUrl: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface ContactInfo {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  businessHours: string;
  googleMapsUrl: string;
  socialLinks: SocialLink[];
}

interface FooterContent {
  companyDescription: string;
}

interface NavigationItem {
  label: string;
  path: string;
  order: number;
  hasDropdown?: boolean;
}

const AdminContentManagementPage: React.FC = () => {
  const [contentData, setContentData] = useState<ContentPage[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [missionPoints, setMissionPoints] = useState<MissionPoint[]>([]);
  const [processPhases, setProcessPhases] = useState<ProcessPhase[]>([]);
  const [siteIdentity, setSiteIdentity] = useState<SiteIdentity>({
    siteTitle: 'ClickBit - Web Solutions',
    metaDescription: 'ClickBit - Custom Web & Software Solutions',
    faviconUrl: '/favicon.ico'
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone1: '+61 2 7229 9577',
    phone2: '+61 422 512 130',
    email: 'info@clickbit.com.au',
    address: '44 Shoreline Road\nMoorebank NSW 2170\nAustralia',
    businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nWeekend: By appointment',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.643330663454!2d150.9133093152115!3d-33.9249269806403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b1295a3c9a35e7d%3A0x8f4f4c9c1c4f2e5a!2s44%20Shoreline%20Rd%2C%20Moorebank%20NSW%202170%2C%20Australia!5e0!3m2!1sen!2sus!4v1620211993456!5m2!1sen!2sus',
    socialLinks: []
  });
  const [footerContent, setFooterContent] = useState<FooterContent>({
    companyDescription: 'Empowering businesses with innovative digital solutions to connect, engage, and grow.'
  });
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const { token } = useAuth();

  // Default content structure for the website
  const defaultContent: ContentPage[] = [
    {
      name: 'Home Page',
      sections: [
        // Hero Section
        {
          id: 'hero-title',
          type: 'text',
          section: 'hero',
          key: 'title',
          label: 'Hero Title',
          value: 'Inspired by Creativity, Driven by Conversions',
          description: 'Main heading on the homepage',
          page: 'home'
        },
        {
          id: 'hero-subtitle',
          type: 'rich_text',
          section: 'hero',
          key: 'subtitle',
          label: 'Hero Subtitle',
          value: 'At ClickBit, we craft amazing websites, data-backed marketing campaigns, and cutting-edge design assets that turn clicks into customers.',
          description: 'Subtitle text below the main heading',
          page: 'home'
        },
        {
          id: 'hero-cta',
          type: 'text',
          section: 'hero',
          key: 'cta_text',
          label: 'Hero Call-to-Action Button',
          value: 'Start Your Project',
          page: 'home'
        },
        
        // Stats Grid Section
        {
          id: 'stats-main-title',
          type: 'text',
          section: 'stats',
          key: 'main_title',
          label: 'Stats Main Title',
          value: 'ClickBIT has helped',
          description: 'Text before the animated number',
          page: 'home'
        },
        {
          id: 'stats-main-number',
          type: 'text',
          section: 'stats',
          key: 'main_number',
          label: 'Companies Helped Count',
          value: '350',
          description: 'Number of companies helped (animated)',
          page: 'home'
        },
        {
          id: 'stats-main-suffix',
          type: 'text',
          section: 'stats',
          key: 'main_suffix',
          label: 'Stats Main Suffix',
          value: '+ companies create and establish their digital presence',
          description: 'Text after the animated number',
          page: 'home'
        },
        {
          id: 'stats-satisfaction-value',
          type: 'text',
          section: 'stats',
          key: 'satisfaction_value',
          label: 'Customer Satisfaction Percentage',
          value: '95',
          description: 'Customer satisfaction percentage',
          page: 'home'
        },
        {
          id: 'stats-satisfaction-title',
          type: 'text',
          section: 'stats',
          key: 'satisfaction_title',
          label: 'Customer Satisfaction Title',
          value: 'Customer Satisfaction',
          page: 'home'
        },
        {
          id: 'stats-satisfaction-desc',
          type: 'text',
          section: 'stats',
          key: 'satisfaction_desc',
          label: 'Customer Satisfaction Description',
          value: 'Achieved a 95% customer satisfaction rate across all projects.',
          page: 'home'
        },
        {
          id: 'stats-delivery-value',
          type: 'text',
          section: 'stats',
          key: 'delivery_value',
          label: 'Delivery Time Value',
          value: '14',
          description: 'Average delivery time in days',
          page: 'home'
        },
        {
          id: 'stats-delivery-suffix',
          type: 'text',
          section: 'stats',
          key: 'delivery_suffix',
          label: 'Delivery Time Suffix',
          value: 'days',
          page: 'home'
        },
        {
          id: 'stats-delivery-title',
          type: 'text',
          section: 'stats',
          key: 'delivery_title',
          label: 'Fast Delivery Title',
          value: 'Fast & Efficient',
          page: 'home'
        },
        {
          id: 'stats-delivery-desc',
          type: 'text',
          section: 'stats',
          key: 'delivery_desc',
          label: 'Fast Delivery Description',
          value: 'Delivering high-quality solutions within an optimized timeline, ensuring speed, precision, and maximum efficiency.',
          page: 'home'
        },

        // Dynamic Ribbon Section
        {
          id: 'ribbon-text',
          type: 'text',
          section: 'ribbon',
          key: 'text',
          label: 'Ribbon Scrolling Text',
          value: 'Creative Solutions / Data-Driven Results / Web Development / Digital Marketing /',
          description: 'Text that scrolls in the animated ribbon',
          page: 'home'
        },

        // Mission Section
        {
          id: 'mission-title',
          type: 'text',
          section: 'mission',
          key: 'title',
          label: 'Mission Section Title',
          value: 'Our Mission:',
          page: 'home'
        },
        {
          id: 'mission-highlight',
          type: 'text',
          section: 'mission',
          key: 'highlight',
          label: 'Mission Highlighted Text',
          value: 'Your Growth',
          description: 'Highlighted part of mission title',
          page: 'home'
        },

        // Our Process Section
        {
          id: 'process-title',
          type: 'text',
          section: 'process',
          key: 'title',
          label: 'Process Section Title',
          value: 'Our Path to',
          page: 'home'
        },
        {
          id: 'process-highlight',
          type: 'text',
          section: 'process',
          key: 'highlight',
          label: 'Process Highlighted Text',
          value: 'Your Success',
          description: 'Highlighted part of process title',
          page: 'home'
        },
        {
          id: 'process-description',
          type: 'rich_text',
          section: 'process',
          key: 'description',
          label: 'Process Section Description',
          value: 'A transparent and collaborative process designed for results. We follow a structured four-phase approach to ensure quality and clarity from start to finish.',
          page: 'home'
        },

        // Services Section
        {
          id: 'services-title',
          type: 'text',
          section: 'services',
          key: 'title',
          label: 'Services Section Title',
          value: 'Our Services',
          page: 'home'
        },
        {
          id: 'services-description',
          type: 'rich_text',
          section: 'services',
          key: 'description',
          label: 'Services Section Description',
          value: 'Comprehensive digital solutions tailored to your business needs.',
          page: 'home'
        },

        // Featured Work Section
        {
          id: 'portfolio-title',
          type: 'text',
          section: 'portfolio',
          key: 'title',
          label: 'Featured Work Title',
          value: 'Our Featured Work',
          page: 'home'
        },
        {
          id: 'portfolio-description',
          type: 'rich_text',
          section: 'portfolio',
          key: 'description',
          label: 'Featured Work Description',
          value: 'Explore our portfolio of innovative digital solutions. Click on any image to view details or visit the live project.',
          page: 'home'
        }
      ]
    },
    {
      name: 'About Page',
      sections: [
        {
          id: 'about-hero-title',
          type: 'text',
          section: 'hero',
          key: 'title',
          label: 'About Page Title',
          value: 'About Us',
          page: 'about'
        },
        {
          id: 'about-main-title',
          type: 'text',
          section: 'main',
          key: 'title',
          label: 'About Main Title',
          value: 'Unleashing the Potential of',
          page: 'about'
        },
        {
          id: 'about-main-highlight',
          type: 'text',
          section: 'main',
          key: 'highlight',
          label: 'About Main Highlighted Text',
          value: 'Your Business',
          page: 'about'
        },
        {
          id: 'about-main-suffix',
          type: 'text',
          section: 'main',
          key: 'suffix',
          label: 'About Main Title Suffix',
          value: 'Utilizing Intelligent Solutions',
          page: 'about'
        },
        {
          id: 'about-custom-solution-title',
          type: 'text',
          section: 'cards',
          key: 'custom_title',
          label: 'Custom Solution Card Title',
          value: 'Customised Solution',
          page: 'about'
        },
        {
          id: 'about-custom-solution-text',
          type: 'rich_text',
          section: 'cards',
          key: 'custom_text',
          label: 'Custom Solution Card Text',
          value: 'No two businesses are the same, and your IT solutions shouldn\'t be either. We take the time to get to know your company, its goals, and its challenges, so we can create custom strategies that fit you perfectly.',
          page: 'about'
        },
        {
          id: 'about-support-title',
          type: 'text',
          section: 'cards',
          key: 'support_title',
          label: 'Support Card Title',
          value: 'Start to Finish Support',
          page: 'about'
        },
        {
          id: 'about-support-number',
          type: 'text',
          section: 'cards',
          key: 'support_number',
          label: 'Support Card Number',
          value: '9+',
          description: 'Number displayed in support card',
          page: 'about'
        },
        {
          id: 'about-support-label',
          type: 'text',
          section: 'cards',
          key: 'support_label',
          label: 'Support Card Label',
          value: 'Happy Clients',
          page: 'about'
        },
        {
          id: 'about-team-subtitle',
          type: 'text',
          section: 'team',
          key: 'subtitle',
          label: 'Team Section Subtitle',
          value: '/ team /',
          page: 'about'
        },
        {
          id: 'about-team-title',
          type: 'text',
          section: 'team',
          key: 'title',
          label: 'Team Section Title',
          value: 'The ClickBIT Experts: uniting talent for',
          page: 'about'
        },
        {
          id: 'about-team-highlight',
          type: 'text',
          section: 'team',
          key: 'highlight',
          label: 'Team Section Highlighted Text',
          value: 'intelligent solutions',
          page: 'about'
        },
        {
          id: 'about-team-number',
          type: 'text',
          section: 'team',
          key: 'number',
          label: 'Team Members Count',
          value: '10+',
          page: 'about'
        },
        {
          id: 'about-team-label',
          type: 'text',
          section: 'team',
          key: 'label',
          label: 'Team Members Label',
          value: 'Awesome team members',
          page: 'about'
        }
      ]
    },
    {
      name: 'Services Page',
      sections: [
        {
          id: 'services-hero-title',
          type: 'text',
          section: 'hero',
          key: 'title',
          label: 'Services Page Title',
          value: 'Our Services',
          page: 'services'
        },
        {
          id: 'services-hero-description',
          type: 'rich_text',
          section: 'hero',
          key: 'description',
          label: 'Services Page Description',
          value: 'Explore our comprehensive range of services designed to help your business grow and succeed in the digital landscape.',
          page: 'services'
        }
      ]
    },
    {
      name: 'FAQ Page',
      sections: [
        {
          id: 'faq-hero-title',
          type: 'text',
          section: 'hero',
          key: 'title',
          label: 'FAQ Page Title',
          value: 'Frequently Asked Questions',
          page: 'faq'
        },
        {
          id: 'faq-contact-title',
          type: 'text',
          section: 'contact',
          key: 'title',
          label: 'FAQ Contact Section Title',
          value: 'Still Have Questions?',
          page: 'faq'
        },
        {
          id: 'faq-contact-description',
          type: 'text',
          section: 'contact',
          key: 'description',
          label: 'FAQ Contact Description',
          value: 'Can\'t find the answer you\'re looking for? We\'re here to help!',
          page: 'faq'
        },
        {
          id: 'faq-contact-cta',
          type: 'text',
          section: 'contact',
          key: 'cta',
          label: 'FAQ Contact Button Text',
          value: 'Contact Us',
          page: 'faq'
        }
      ]
    },
    {
      name: 'Contact Page',
      sections: [
        {
          id: 'contact-hero-title',
          type: 'text',
          section: 'hero',
          key: 'title',
          label: 'Contact Page Title',
          value: 'Get In Touch',
          page: 'contact'
        },
        {
          id: 'contact-form-title',
          type: 'text',
          section: 'form',
          key: 'title',
          label: 'Contact Form Title',
          value: 'Send us a message',
          page: 'contact'
        },
        {
          id: 'contact-info-title',
          type: 'text',
          section: 'info',
          key: 'title',
          label: 'Contact Info Title',
          value: 'Contact Information',
          page: 'contact'
        }
      ]
    },
    {
      name: 'Global Elements',
      sections: [
        {
          id: 'company-name',
          type: 'text',
          section: 'global',
          key: 'company_name',
          label: 'Company Name',
          value: 'ClickBit',
          page: 'global'
        },
        {
          id: 'company-tagline',
          type: 'text',
          section: 'global',
          key: 'tagline',
          label: 'Company Tagline',
          value: 'Innovative Digital Solutions',
          page: 'global'
        },
        {
          id: 'footer-text',
          type: 'rich_text',
          section: 'footer',
          key: 'copyright',
          label: 'Footer Copyright Text',
          value: '© 2024 ClickBit. All rights reserved.',
          page: 'global'
        },
        {
          id: 'logo-light',
          type: 'image',
          section: 'global',
          key: 'logo_light',
          label: 'Logo (Light Mode)',
          value: '/logo.svg',
          page: 'global'
        },
        {
          id: 'logo-dark',
          type: 'image',
          section: 'global',
          key: 'logo_dark',
          label: 'Logo (Dark Mode)',
          value: '/logo-dark.svg',
          page: 'global'
        }
      ]
    }
  ];

  useEffect(() => {
    fetchContent();
    fetchFAQs();
    fetchMissionPoints();
    fetchProcessPhases();
    fetchSiteIdentity();
    fetchContactInfo();
    fetchFooterContent();
    fetchNavigation();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/content-management', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.length > 0) {
        setContentData(response.data);
      } else {
        // Use default content if none exists
        setContentData(defaultContent);
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
      // Use default content on error
      setContentData(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await api.get('/admin/faq', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqItems(response.data);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  const fetchMissionPoints = async () => {
    try {
      const response = await api.get('/admin/mission-points', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMissionPoints(response.data);
    } catch (err) {
      console.error('Failed to fetch mission points:', err);
    }
  };

  const fetchProcessPhases = async () => {
    try {
      const response = await api.get('/admin/process-phases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProcessPhases(response.data);
    } catch (err) {
      console.error('Failed to fetch process phases:', err);
    }
  };

  const fetchSiteIdentity = async () => {
    try {
      const response = await api.get('/admin/site-identity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSiteIdentity(response.data);
    } catch (err) {
      console.error('Failed to fetch site identity:', err);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await api.get('/admin/contact-info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactInfo(response.data);
    } catch (err) {
      console.error('Failed to fetch contact info:', err);
    }
  };

  const fetchFooterContent = async () => {
    try {
      const response = await api.get('/admin/footer-content', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFooterContent(response.data);
    } catch (err) {
      console.error('Failed to fetch footer content:', err);
    }
  };

  const fetchNavigation = async () => {
    try {
      const response = await api.get('/admin/navigation', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNavigation(response.data.sort((a: NavigationItem, b: NavigationItem) => a.order - b.order));
    } catch (err) {
      console.error('Failed to fetch navigation:', err);
    }
  };

  const saveContent = async (item: ContentSection) => {
    try {
      setSaving(true);
      await api.put('/admin/content-management', item, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save content. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
      setEditingItem(null);
    }
  };

  const saveFAQs = async () => {
    try {
      setSaving(true);
      await api.put('/admin/faq', { faqItems }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save FAQs. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveMissionPoints = async () => {
    try {
      setSaving(true);
      await api.put('/admin/mission-points', { missionPoints }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save mission points. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveProcessPhases = async () => {
    try {
      setSaving(true);
      await api.put('/admin/process-phases', { processPhases }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save process phases. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveSiteIdentity = async () => {
    try {
      setSaving(true);
      await api.put('/admin/site-identity', { siteIdentity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save site identity. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveContactInfo = async () => {
    try {
      setSaving(true);
      await api.put('/admin/contact-info', { contactInfo }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save contact info. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveFooterContent = async () => {
    try {
      setSaving(true);
      await api.put('/admin/footer-content', { footerContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save footer content. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveNavigation = async () => {
    try {
      setSaving(true);
      await api.put('/admin/navigation', { navigation }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to save navigation. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (itemId: string, newValue: string) => {
    setContentData(prev => prev.map(page => ({
      ...page,
      sections: page.sections.map(section => 
        section.id === itemId ? { ...section, value: newValue } : section
      )
    })));
  };

  const addFAQItem = () => {
    setFaqItems([...faqItems, {
      question: '',
      answer: '',
      category: 'General'
    }]);
  };

  const removeFAQItem = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const updateFAQItem = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqItems];
    updated[index] = { ...updated[index], [field]: value };
    setFaqItems(updated);
  };

  const addMissionPoint = () => {
    setMissionPoints([...missionPoints, {
      icon: 'Target',
      title: '',
      description: ''
    }]);
  };

  const removeMissionPoint = (index: number) => {
    setMissionPoints(missionPoints.filter((_, i) => i !== index));
  };

  const updateMissionPoint = (index: number, field: keyof MissionPoint, value: string) => {
    const updated = [...missionPoints];
    updated[index] = { ...updated[index], [field]: value };
    setMissionPoints(updated);
  };

  const updateSiteIdentity = (field: keyof SiteIdentity, value: string) => {
    setSiteIdentity(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const addSocialLink = () => {
    setContactInfo(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setContactInfo(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const updateFooterContent = (field: keyof FooterContent, value: string) => {
    setFooterContent(prev => ({ ...prev, [field]: value }));
  };

  const addNavigationItem = () => {
    const maxOrder = Math.max(...navigation.map(item => item.order), 0);
    setNavigation(prev => [...prev, {
      label: '',
      path: '',
      order: maxOrder + 1,
      hasDropdown: false
    }]);
  };

  const removeNavigationItem = (index: number) => {
    setNavigation(navigation.filter((_, i) => i !== index));
  };

  const updateNavigationItem = (index: number, field: keyof NavigationItem, value: string | number | boolean) => {
    setNavigation(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const moveNavigationItem = (index: number, direction: 'up' | 'down') => {
    const newNavigation = [...navigation];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newNavigation.length) {
      [newNavigation[index], newNavigation[targetIndex]] = [newNavigation[targetIndex], newNavigation[index]];
      
      // Update order values
      newNavigation.forEach((item, i) => {
        item.order = i + 1;
      });
      
      setNavigation(newNavigation);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'rich_text': return <Edit2 className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const renderEditField = (item: ContentSection) => {
    if (item.type === 'image') {
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={item.value}
            onChange={(e) => handleContentChange(item.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter image URL"
          />
          {item.value && (
            <div className="mt-2">
              <img 
                src={item.value} 
                alt={item.label}
                className="h-20 w-auto object-contain rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      );
    }

    if (item.type === 'rich_text') {
      return (
        <textarea
          value={item.value}
          onChange={(e) => handleContentChange(item.id, e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder={item.description}
        />
      );
    }

    return (
      <input
        type="text"
        value={item.value}
        onChange={(e) => handleContentChange(item.id, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder={item.description}
      />
    );
  };

  const tabs = [
    ...contentData.map(page => ({
      key: page.name.toLowerCase().replace(/\s+/g, '-'),
      label: page.name,
      icon: page.name === 'Global Elements' ? Globe : Type
    })),
    {
      key: 'site-identity',
      label: 'Site Identity',
      icon: Settings
    },
    {
      key: 'contact-socials',
      label: 'Contact & Socials',
      icon: Phone
    },
    {
      key: 'footer-content',
      label: 'Footer Content',
      icon: FileText
    },
    {
      key: 'navigation',
      label: 'Navigation',
      icon: Navigation
    },
    {
      key: 'faq-management',
      label: 'FAQ Management',
      icon: HelpCircle
    },
    {
      key: 'mission-points',
      label: 'Mission Points',
      icon: Target
    },
    {
      key: 'process-phases',
      label: 'Process Phases',
      icon: Zap
    }
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activePage = contentData.find(page => 
    page.name.toLowerCase().replace(/\s+/g, '-') === activeTab
  );

  const renderFAQManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FAQ Management</h2>
        <div className="space-x-2">
          <button
            onClick={addFAQItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add FAQ</span>
          </button>
          <button
            onClick={saveFAQs}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      {faqItems.map((faq, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ #{index + 1}</h3>
            <button
              onClick={() => removeFAQItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={faq.category}
                onChange={(e) => updateFAQItem(index, 'category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="General">General</option>
                <option value="Pricing & Payment">Pricing & Payment</option>
                <option value="Technical">Technical</option>
                <option value="Process & Communication">Process & Communication</option>
                <option value="SEO & Marketing">SEO & Marketing</option>
                <option value="Infrastructure & Cloud">Infrastructure & Cloud</option>
                <option value="Business Systems">Business Systems</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question
              </label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter the FAQ question"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Answer
              </label>
              <textarea
                value={faq.answer}
                onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter the FAQ answer"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMissionPoints = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mission Points Management</h2>
        <div className="space-x-2">
          <button
            onClick={addMissionPoint}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Point</span>
          </button>
          <button
            onClick={saveMissionPoints}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      {missionPoints.map((point, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mission Point #{index + 1}</h3>
            <button
              onClick={() => removeMissionPoint(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon (Lucide React icon name)
              </label>
              <input
                type="text"
                value={point.icon}
                onChange={(e) => updateMissionPoint(index, 'icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Users, Target, Gem"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={point.title}
                onChange={(e) => updateMissionPoint(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter the mission point title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={point.description}
                onChange={(e) => updateMissionPoint(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter the mission point description"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edit text and images across your website from one central location.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        {activePage && (
          <div className="space-y-6">
            {activePage.sections.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getIconForType(item.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingItem === item.id ? (
                      <>
                        <button
                          onClick={() => saveContent(item)}
                          disabled={saving}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-1"
                        >
                          <Save className="h-4 w-4" />
                          <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingItem(item.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {editingItem === item.id ? (
                  <div className="space-y-4">
                    {renderEditField(item)}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                    {item.type === 'image' ? (
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.value} 
                          alt={item.label}
                          className="h-16 w-auto object-contain rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.textContent = 'Image not found';
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 break-all">
                          {item.value}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {item.value}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            How to Use Content Management
          </h3>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300">
            <li>• Click "Edit" on any content section to modify text or image URLs</li>
            <li>• Use the tabs above to navigate between different pages</li>
            <li>• Changes are saved immediately when you click "Save"</li>
            <li>• For images, enter the full URL path (e.g., /images/hero-bg.jpg)</li>
            <li>• Rich text sections support basic formatting and line breaks</li>
          </ul>
        </div>

        {/* Additional Sections */}
        {activeTab === 'faq-management' && renderFAQManagement()}
        {activeTab === 'mission-points' && renderMissionPoints()}
      </div>
    </div>
  );

  // Additional render functions for new tabs
  function renderSiteIdentity() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Site Identity</h2>
          <button
            onClick={saveSiteIdentity}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website Title
              </label>
              <input
                type="text"
                value={siteIdentity.siteTitle}
                onChange={(e) => updateSiteIdentity('siteTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter website title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                value={siteIdentity.metaDescription}
                onChange={(e) => updateSiteIdentity('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter meta description for SEO"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Favicon URL
              </label>
              <input
                type="url"
                value={siteIdentity.faviconUrl}
                onChange={(e) => updateSiteIdentity('faviconUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter favicon URL"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderContactSocials() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact & Social Media</h2>
          <button
            onClick={saveContactInfo}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Phone
              </label>
              <input
                type="text"
                value={contactInfo.phone1}
                onChange={(e) => updateContactInfo('phone1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter primary phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Phone
              </label>
              <input
                type="text"
                value={contactInfo.phone2}
                onChange={(e) => updateContactInfo('phone2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter secondary phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Maps URL
              </label>
              <input
                type="url"
                value={contactInfo.googleMapsUrl}
                onChange={(e) => updateContactInfo('googleMapsUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter Google Maps embed URL"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={contactInfo.address}
              onChange={(e) => updateContactInfo('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter business address"
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Hours
            </label>
            <textarea
              value={contactInfo.businessHours}
              onChange={(e) => updateContactInfo('businessHours', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter business hours"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Links</h3>
            <button
              onClick={addSocialLink}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Link</span>
            </button>
          </div>
          
          {contactInfo.socialLinks.map((link, index) => (
            <div key={index} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Platform (e.g., Facebook, LinkedIn)"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                className="flex-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="URL"
              />
              <button
                onClick={() => removeSocialLink(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderFooterContent() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Footer Content</h2>
          <button
            onClick={saveFooterContent}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Description
            </label>
            <textarea
              value={footerContent.companyDescription}
              onChange={(e) => updateFooterContent('companyDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter company description for footer"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderNavigation() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Navigation Management</h2>
          <div className="space-x-2">
            <button
              onClick={addNavigationItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
            <button
              onClick={saveNavigation}
              disabled={saving}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save All'}</span>
            </button>
          </div>
        </div>

        {navigation.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation Item #{index + 1}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => moveNavigationItem(index, 'up')}
                  disabled={index === 0}
                  className="px-2 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveNavigationItem(index, 'down')}
                  disabled={index === navigation.length - 1}
                  className="px-2 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeNavigationItem(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateNavigationItem(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter menu label"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Path
                </label>
                <input
                  type="text"
                  value={item.path}
                  onChange={(e) => updateNavigationItem(index, 'path', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter path (e.g., /about)"
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.hasDropdown || false}
                    onChange={(e) => updateNavigationItem(index, 'hasDropdown', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Has Dropdown</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderProcessPhases() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Process Phases Management</h2>
          <button
            onClick={saveProcessPhases}
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>

        {processPhases.map((phase, index) => (
          <div key={phase.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Phase {phase.id}: {phase.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Icon (Lucide React)
                </label>
                <input
                  type="text"
                  value={phase.mainIcon}
                  onChange={(e) => {
                    const updated = [...processPhases];
                    updated[index] = { ...updated[index], mainIcon: e.target.value };
                    setProcessPhases(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., MessageSquare, Palette"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={phase.title}
                  onChange={(e) => {
                    const updated = [...processPhases];
                    updated[index] = { ...updated[index], title: e.target.value };
                    setProcessPhases(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phase title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={phase.subtitle}
                  onChange={(e) => {
                    const updated = [...processPhases];
                    updated[index] = { ...updated[index], subtitle: e.target.value };
                    setProcessPhases(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phase subtitle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color (Tailwind class)
                </label>
                <input
                  type="text"
                  value={phase.color}
                  onChange={(e) => {
                    const updated = [...processPhases];
                    updated[index] = { ...updated[index], color: e.target.value };
                    setProcessPhases(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., text-blue-600"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={phase.description}
                onChange={(e) => {
                  const updated = [...processPhases];
                  updated[index] = { ...updated[index], description: e.target.value };
                  setProcessPhases(updated);
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter phase description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deliverables
              </label>
              {phase.deliverables.map((deliverable, delIndex) => (
                <div key={delIndex} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={deliverable.icon}
                    onChange={(e) => {
                      const updated = [...processPhases];
                      updated[index].deliverables[delIndex].icon = e.target.value;
                      setProcessPhases(updated);
                    }}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Icon"
                  />
                  <input
                    type="text"
                    value={deliverable.text}
                    onChange={(e) => {
                      const updated = [...processPhases];
                      updated[index].deliverables[delIndex].text = e.target.value;
                      setProcessPhases(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Deliverable text"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render the appropriate content based on active tab
  if (activeTab === 'site-identity') return renderSiteIdentity();
  if (activeTab === 'contact-socials') return renderContactSocials();
  if (activeTab === 'footer-content') return renderFooterContent();
  if (activeTab === 'navigation') return renderNavigation();
  if (activeTab === 'process-phases') return renderProcessPhases();
};

export default AdminContentManagementPage;