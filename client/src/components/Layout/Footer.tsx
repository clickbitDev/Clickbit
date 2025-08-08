import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../contexts/ContentContext';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { animateScroll as scroll } from 'react-scroll';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const { contactInfo, footerContent } = useContent();
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch services and group by category
    const fetchServices = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || '/api';
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        // Group services by category
        const grouped: Record<string, any[]> = {};
        data.forEach((service: any) => {
          if (!service.category) return;
          if (!grouped[service.category]) grouped[service.category] = [];
          grouped[service.category].push(service);
        });
        // Convert to array of { name, slug }
        const categories = Object.entries(grouped).map(([name, items]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+&\s+/g, '-and-').replace(/\s+/g, '-')
        }));
        setServiceCategories(categories);
      } catch (err) {
        setServiceCategories([]);
      }
    };
    fetchServices();
  }, []);

  const companyLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Frequently Asked Questions', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  // Map social platform names to icons
  const socialIconMap: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
  };

  const getSocialIcon = (platform: string) => {
    const key = platform.toLowerCase();
    return socialIconMap[key] || Facebook; // Default to Facebook icon
  };

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      smooth: 'easeInOutCubic',
    });
  };

  return (
    <footer className="bg-gray-50 dark:bg-[#111827] text-gray-800 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Company Info */}
          <div className="md:col-span-2 lg:col-span-1 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Link to="/" className="mb-6 inline-block">
                <img 
                  src={theme === 'dark' ? '/images/logos/logo-full-dark.png' : '/images/logos/logo-full.png'} 
                  alt="ClickBit Logo" 
                  className="w-40" 
                />
              </Link>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto md:mx-0">
              {footerContent.companyDescription || 'Empowering businesses with innovative digital solutions to connect, engage, and grow.'}
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {contactInfo.socialLinks.map((social, index) => {
                const IconComponent = getSocialIcon(social.platform);
                return (
                  <a 
                    key={index} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#1FBBD2] dark:hover:text-[#1FBBD2] transition-colors duration-300"
                    aria-label={social.platform}
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.href} className="text-gray-500 dark:text-gray-400 hover:text-[#1FBBD2] transition-all duration-300 text-base inline-block relative group">
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1FBBD2] transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Our Services
            </h3>
            <ul className="space-y-3">
              {serviceCategories.map((category) => (
                <li key={category.name}>
                  <Link to={`/services?category=${category.slug}`} className="text-gray-500 dark:text-gray-400 hover:text-[#1FBBD2] transition-all duration-300 text-base inline-block relative group">
                    {category.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1FBBD2] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              {contactInfo.address && (
                <li className="flex items-start justify-center md:justify-start">
                  <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-[#1FBBD2]" />
                  <span className="whitespace-pre-line">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-start justify-center md:justify-start">
                  <Mail size={18} className="mr-3 mt-1 flex-shrink-0 text-[#1FBBD2]" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-[#1FBBD2] transition-all duration-300 relative group">
                    {contactInfo.email}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1FBBD2] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              )}
              {contactInfo.phone1 && (
                <li className="flex items-start justify-center md:justify-start">
                  <Phone size={18} className="mr-3 mt-1 flex-shrink-0 text-[#1FBBD2]" />
                  <a href={`tel:${contactInfo.phone1.replace(/\s/g, '')}`} className="hover:text-[#1FBBD2] transition-all duration-300 relative group">
                    {contactInfo.phone1}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1FBBD2] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              )}
            </ul>
            <Link to="/contact" className="mt-6 inline-block w-full text-center px-6 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#1FBBD2] hover:bg-[#1A9DAA] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Send a Message
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800 -mx-4 px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-center sm:text-left text-sm">
                © {currentYear} ClickBit.com.au. All rights reserved.
              </p>
              <span className="text-gray-400 dark:text-gray-500 text-sm">•</span>
              <a 
                href="https://clickbit.com.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-[#1FBBD2] transition-colors duration-300 text-sm"
              >
                Designed by ClickBIT
              </a>
            </div>
            <button 
              onClick={scrollToTop}
              className="group inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#1FBBD2] hover:border-[#1FBBD2] dark:hover:text-[#1FBBD2] dark:hover:border-[#1FBBD2] transition-all duration-300 hover:shadow-lg"
              aria-label="Back to top"
            >
              <ArrowUp size={18} className="transition-transform duration-300 ease-in-out group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;