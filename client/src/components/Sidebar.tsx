import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../contexts/SidebarContext';
import { X, MapPin, Mail, Phone, Facebook, Instagram, Linkedin, PhoneCall, Youtube, Github } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import XIcon from './XIcon';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const { theme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  };

  const contactDetails = [
      { label: "Mobile", icon: Phone, text: "+61 422 512 130", href: "tel:+61422512130" },
      { label: "Phone", icon: PhoneCall, text: "02 7229 9577", href: "tel:+61272299577" },
      { label: "Email", icon: Mail, text: "info@clickbit.com.au", href: "mailto:info@clickbit.com.au" },
      { label: "Office", icon: MapPin, text: "44 Shoreline Road Moorebank NSW 2170", href: "#" },
  ]

  const socialLinks: any[] = [
    { icon: Facebook, href: "https://www.facebook.com/clickbitau/", name: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/clickbitau/", name: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/clickbitau/", name: "LinkedIn" },
    { icon: XIcon, href: "https://x.com/ClickBITau", name: "X" },
    { icon: SiTiktok, href: "https://www.tiktok.com/@clickbitau", name: "TikTok" },
    { icon: Youtube, href: "https://www.youtube.com/@clickbitau", name: "YouTube" },
    { icon: Github, href: "https://github.com/clickbitau", name: "GitHub" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed top-0 left-0 h-full w-full max-w-lg p-4 pointer-events-none z-50">
            <motion.div
              ref={sidebarRef}
              className="h-full w-full bg-white/80 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900/80 dark:backdrop-blur-xl dark:backdrop-saturate-50 shadow-2xl rounded-4xl flex pointer-events-auto"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex-grow p-6 flex flex-col overflow-y-auto">
                <div className="flex justify-end items-center mb-8">
                   {/* Close button is now on the right bar, so this is empty or can be removed */}
                </div>
                
                <div className="flex-grow flex flex-col justify-center space-y-4">
                    <h3 className="px-3 text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Get in Touch</h3>
                    <div className="space-y-2">
                      {contactDetails.map((item, index) => (
                          <a href={item.href} key={index} className="flex items-start space-x-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors duration-300 group">
                              <item.icon className="w-5 h-5 mt-1 text-gray-400 dark:text-gray-500 group-hover:text-[#1FBBD2] transition-colors duration-300 flex-shrink-0" />
                              <div className="flex flex-col">
                                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.label}</span>
                                  <span className="text-base leading-snug text-gray-800 dark:text-gray-200">{item.text}</span>
                              </div>
                          </a>
                      ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-center h-32 border-b border-gray-200 dark:border-gray-800 mb-8">
                    <Link to="/" className="flex items-center space-x-2 p-8 pb-12">
                      <img src={theme === 'dark' ? '/images/logos/clickbit-logo-single-color-light.png' : '/images/logos/Click Bit Logo Vec Full.png'} alt="ClickBit Logo" className="w-32" loading="lazy" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {/* Debug: Show count of social links */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-gray-400 mb-2 w-full text-center">
                        Social Links: {socialLinks.length} platforms
                      </div>
                    )}
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-gray-400 hover:text-[#1FBBD2] transition-colors duration-300 p-1 hover:scale-110 transform" title={social.name}>
                          <IconComponent size={22} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div 
                className="w-20 flex-shrink-0 bg-transparent cursor-pointer relative rounded-r-4xl overflow-hidden"
                onClick={closeSidebar}
              >
                 <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/patterns/sidebar-pattern.svg')"}}
                  ></div>
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 flex flex-col items-center justify-center text-white/70 hover:text-white">
                  <X className="w-8 h-8 mb-4" />
                  <p className="font-semibold uppercase [writing-mode:vertical-rl] transform rotate-180 tracking-widest text-sm">
                    Close
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar; 