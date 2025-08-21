import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { Menu, X, Search, LayoutGrid, Code, Server, BrainCircuit, Building2, Palette, BarChart2, Award, User } from 'lucide-react';
// import { services } from '../../services/serviceData';
// TODO: Replace static data with API call to backend for services
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import { teamMembers } from '../../services/TEAM_MEMBERS_DATA';
import { softwareLogos } from '../../services/TECHNOLOGY_LOGOS_DATA';
import { getServiceIcon } from '../../services/SERVICE_ICONS_MAPPING';

// Icon mapping for service categories
const categoryIcons: { [key: string]: React.ElementType } = {
  'Development': Code,
  'Infrastructure': Server,
  'Specialized Tech': BrainCircuit,
  'Business Systems': Building2,
  'Design & Branding': Palette,
  'Marketing & Growth': BarChart2,
  'Business Packages': Award,
};

const MobileNavLink = ({ to, children, onClick }: { to: string; children: ReactNode; onClick: () => void; }) => (
  <motion.div variants={mobileNavItemVariants}>
    <Link to={to} onClick={onClick} className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#1FBBD2] dark:hover:text-[#1FBBD2] transition-colors duration-200">
      {children}
    </Link>
  </motion.div>
);

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
      duration: 0.2
    }
  },
  exit: { opacity: 0, y: -20 }
};

const mobileNavItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

const Header: React.FC = () => {
  const { theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const { itemCount } = useCart();
  const { isAuthenticated, logout, user, isLoading } = useAuth();
  const { isConnected, isAuthenticated: socketAuthenticated, activeSessionUser } = useSocket();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const servicesMenuTimeout = useRef<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [isMobileUserTooltipOpen, setIsMobileUserTooltipOpen] = useState(false);



  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile user tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileUserTooltipOpen && !target.closest('.mobile-user-tooltip-container')) {
        setIsMobileUserTooltipOpen(false);
      }
    };

    if (isMobileUserTooltipOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileUserTooltipOpen]);
  
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
        // Convert to array of { name, slug, items }
        const categories = Object.entries(grouped).map(([name, items]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+&\s+/g, '-and-').replace(/\s+/g, '-'),
          items: items.map(item => ({
            ...item,
            href: item.href || `/services/${item.slug}`,
            desc: item.desc || item.description,
            iconComponent: getServiceIcon(item.slug, item.name, name) // Use service icon component
          })),
          icon: categoryIcons[name] || Award // Use mapped icon or default
        }));
        setServiceCategories(categories);
      } catch (err) {
        setServiceCategories([]);
      }
    };
    fetchServices();
  }, []);
  
  const handleServicesMenuEnter = () => {
    if (servicesMenuTimeout.current) {
      clearTimeout(servicesMenuTimeout.current);
      servicesMenuTimeout.current = null;
    }
    setServicesMenuOpen(true);
  };

  const handleServicesMenuLeave = () => {
    servicesMenuTimeout.current = window.setTimeout(() => {
      setServicesMenuOpen(false);
    }, 200);
  };
  
  const handleSidebarToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSidebar();
  };

  const headerClasses = `flex-grow rounded-full bg-white/90 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900/80 dark:backdrop-blur-xl dark:backdrop-saturate-50 shadow-lg border-transparent dark:border dark:border-gray-700/50`;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileUserTooltipOpen(false);
  };
  
  const allServices = Object.values(serviceCategories).flatMap((category: any) => (category.items || []).map((item: any) => ({
    type: 'service',
    name: item.name,
    desc: item.desc || item.description,
    href: item.href || `/services/${item.slug}`,
    icon: categoryIcons[category.name] || Award
  })));
  
  const allTeamMembers = teamMembers.map(member => ({
    type: 'team',
    name: member.name,
    desc: member.role,
    href: '/about',
    icon: null
  }));

  const allPages = [
    { type: 'page', name: 'Services', desc: 'View all our services', href: '/services', icon: null },
    { type: 'page', name: 'About Us', desc: 'Learn more about our company', href: '/about', icon: null },
    { type: 'page', name: 'Contact Us', desc: 'Get in touch with us', href: '/contact', icon: null },
    { type: 'page', name: 'Blog', desc: 'Read our latest articles', href: '/blog', icon: null },
    { type: 'page', name: 'Portfolio', desc: 'See our featured work', href: '/portfolio', icon: null },
  ];

  const allTechnologies = Object.entries(softwareLogos).flatMap(([serviceSlug, techs]) => 
    Object.keys(techs).map(techName => {
      const service = Object.values(serviceCategories).flatMap(cat => cat.items).find(item => item.href === `/services/${serviceSlug}`);
      return {
        type: 'technology',
        name: techName,
        desc: service ? `Used in our ${service.name} service` : 'Technology we use',
        href: service ? service.href : '/services',
        icon: null
      }
    })
  );

  const allItems = [...allServices, ...allTeamMembers, ...allPages, ...allTechnologies];

  const filteredResults = searchQuery.trim().length === 0 ? [] : allItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="sticky top-0 z-50 p-4">
        <div className="flex items-center justify-center space-x-4 max-w-screen-2xl mx-auto">
          {/* CLICKCRM BUTTON - DESKTOP */}
          <a
            href="https://crm.clickbit.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full text-white bg-[#1FBBD2] hover:bg-[#1c9aa8] transition-colors duration-300 flex-shrink-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FBBD2]"
          >
            ClickCRM
          </a>

          {/* LOGIN BUTTON - DESKTOP */}
          {!isLoading && (
            isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden xl:inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors duration-300 flex-shrink-0 shadow-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden xl:inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full text-white bg-[#F39C12] hover:bg-[#E67E22] transition-colors duration-300 flex-shrink-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F39C12]"
              >
                Login
              </Link>
            )
          )}

          {/* MAIN HEADER CAPSULE */}
          <header className={headerClasses}>
            <div className="container mx-auto px-4">
              <div className="relative flex items-center justify-between h-20">
                {/* Left Section */}
                <div className="flex items-center justify-start xl:w-1/4">
                  <button onClick={handleSidebarToggle} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Open sidebar menu">
                    <LayoutGrid size={22} />
                  </button>
                  <button
                    className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <Search size={24} />
                  </button>
                </div>

                {/* Center Section */}
                <div className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <nav className="hidden xl:flex items-center space-x-2">
                    <NavLink 
                      to="/about" 
                      className={({isActive}) => `px-5 py-2.5 rounded-full font-medium text-base transition-colors duration-300 ${isActive ? 'bg-[#1FBBD2] text-white' : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      About
                    </NavLink>
                    <div onMouseEnter={handleServicesMenuEnter} onMouseLeave={handleServicesMenuLeave} className="relative">
                      <NavLink
                        to="/services"
                        className={({isActive}) => `px-5 py-2.5 rounded-full flex items-center font-medium text-base transition-colors duration-300 ${isActive ? 'bg-[#1FBBD2] text-white' : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        Services <ChevronDownIcon className="h-5 w-5 ml-1" />
                      </NavLink>
                      {isServicesMenuOpen && (
                        <div className="absolute -left-1/2 top-full mt-0 w-screen max-w-2xl pointer-events-none">
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white-97 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900-97 dark:backdrop-blur-2xl dark:backdrop-saturate-50 text-black dark:text-white rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 pointer-events-auto"
                          >
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                              {Object.values(serviceCategories)
                                .sort((a, b) => (a.slug === 'business-packages' ? 1 : b.slug === 'business-packages' ? -1 : 0))
                                .map((category, index, arr) => {
                                // For the regular items, we need to know the index *within the filtered group* to determine left/right column
                                const regularItems = arr.filter(c => c.slug !== 'business-packages');
                                const regularIndex = regularItems.findIndex(c => c.slug === category.slug);
                                const isLeftColumn = regularIndex % 2 === 0;
                                const subMenuClasses = `absolute top-0 w-72 bg-white-97 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900-97 dark:backdrop-blur-2xl dark:backdrop-saturate-50 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 transform scale-95 group-hover:scale-100 ${isLeftColumn ? 'right-full mr-3' : 'left-full ml-3'}`;
                                if (category.slug === 'business-packages') {
                                  return (
                                    <div key={category.name} className="col-span-2 relative group mt-2">
                                      <Link 
                                        to={`/services?category=${category.slug}`}
                                        className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 border-2 border-cyan-400 dark:border-cyan-600 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80"
                                      >
                                        <h3 className="font-bold text-base text-cyan-600 dark:text-cyan-400 mb-2 transition-colors flex items-center justify-center">
                                          {category.icon && <category.icon className="h-5 w-5 mr-3" />}
                                          {category.name}
                                        </h3>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                                          <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-1 rounded-full text-xs font-medium">
                                            {category.items.length} packages
                                          </span>
                                        </div>
                                      </Link>
                                      <div className="absolute top-full left-0 mt-2 w-full bg-white-97 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900-97 dark:backdrop-blur-2xl dark:backdrop-saturate-50 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 transform scale-95 group-hover:scale-100">
                                        <div className="p-4">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {category.items.map((item: any) => (
                                              <Link
                                                key={item.name}
                                                to={item.href}
                                                className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800 group/item"
                                              >
                                                <div className="flex items-start space-x-3">
                                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                                    {React.createElement(item.iconComponent, { className: "w-4 h-4 text-white" })}
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors">
                                                      {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                      {item.desc}
                                                    </p>
                                                  </div>
                                                </div>
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={category.name} className="relative group">
                                    <Link 
                                      to={`/services?category=${category.slug}`}
                                      className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800"
                                    >
                                      <h3 className={`font-bold text-base text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center ${isLeftColumn ? 'justify-end' : ''}`}>
                                        {isLeftColumn ? ( <> {category.name} {category.icon && <category.icon className="h-5 w-5 ml-2 text-gray-400 group-hover:text-cyan-500 transition-colors" />} </>
                                        ) : ( <> {category.icon && <category.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-500 transition-colors" />} {category.name} </>
                                        )}
                                      </h3>
                                      <div className={`text-sm text-gray-500 dark:text-gray-400 flex items-center ${isLeftColumn ? 'justify-end' : ''}`}>
                                        <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-1 rounded-full text-xs font-medium">
                                          {category.items.length} services
                                        </span>
                                      </div>
                                    </Link>
                                    <div className={subMenuClasses}>
                                      <div className="p-5">
                                        <div className="flex items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                                          <h4 className="font-bold text-base text-gray-900 dark:text-white">
                                            {category.name}
                                          </h4>
                                        </div>
                                        <div className="space-y-3">
                                          {category.items.map((item: any) => (
                                            <Link 
                                              key={item.name} 
                                              to={item.href} 
                                              className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800 group/item"
                                            >
                                              <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                                  {React.createElement(item.iconComponent, { className: "w-4 h-4 text-white" })}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors">
                                                    {item.name}
                                                  </p>
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                    {item.desc}
                                                  </p>
                                                </div>
                                              </div>
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </nav>
                  <div className="px-6 flex-shrink-0">
                    <Link to="/">
                      <img src={theme === 'light' ? "/logo.svg" : "/logo-dark.svg"} alt="ClickBit Logo" className="h-8" loading="eager" />
                    </Link>
                  </div>
                  <nav className="hidden xl:flex items-center space-x-2">
                    <NavLink 
                      to="/portfolio" 
                      className={({isActive}) => `px-5 py-2.5 rounded-full font-medium text-base transition-colors duration-300 ${isActive ? 'bg-[#1FBBD2] text-white' : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      Portfolio
                    </NavLink>
                    <NavLink 
                      to="/contact" 
                      className={({isActive}) => `px-5 py-2.5 rounded-full font-medium text-base transition-colors duration-300 ${isActive ? 'bg-[#1FBBD2] text-white' : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      Contact
                    </NavLink>
                    {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
                      <NavLink 
                        to="/admin/dashboard" 
                        className={({isActive}) => `px-5 py-2.5 rounded-full font-medium text-base transition-colors duration-300 ${isActive ? 'bg-[#1FBBD2] text-white' : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        Dashboard
                      </NavLink>
                    )}
                  </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center justify-end xl:w-1/4">
                  {/* Desktop Icons */}
                  <div className="hidden xl:flex items-center space-x-2">
                    {/* User Icon - Desktop */}
                    {isAuthenticated && user && (
                      <div className="relative group">
                        <div className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                          <User className="h-6 w-6" />
                          {isConnected && socketAuthenticated && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white dark:border-gray-900"></span>
                          )}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-3 bg-white-97 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900-97 dark:backdrop-blur-2xl dark:backdrop-saturate-50 text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 scale-95 group-hover:scale-100">
                          <div className="font-semibold text-base">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.email}</div>
                          <div className="text-sm text-[#1FBBD2] font-medium capitalize mt-1">{user.role}</div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white dark:border-b-gray-900"></div>
                        </div>
                      </div>
                    )}
                    <Link to="/cart" className="relative p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label={`Shopping cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}>
                      <ShoppingCartIcon className="h-6 w-6" />
                      {itemCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#1FBBD2] text-white text-xs font-medium transform -translate-y-1/2 translate-x-1/2">
                          {itemCount > 99 ? '99+' : itemCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Mobile Icons */}
                  <div className="flex xl:hidden items-center">
                    <Link to="/cart" className="relative p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label={`Shopping cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}>
                      <ShoppingCartIcon className="h-6 w-6" />
                      {itemCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#1FBBD2] text-white text-xs font-medium transform -translate-y-1/2 translate-x-1/2">
                          {itemCount > 99 ? '99+' : itemCount}
                        </span>
                      )}
                    </Link>
                    {/* User Icon - Mobile */}
                    {isAuthenticated && user && (
                      <div className="relative mr-2 mobile-user-tooltip-container">
                        <button 
                          onClick={() => setIsMobileUserTooltipOpen(!isMobileUserTooltipOpen)}
                          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1FBBD2] focus:ring-offset-2"
                          aria-label="User profile"
                        >
                          <User className="h-5 w-5" />
                          {isConnected && socketAuthenticated && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border border-white dark:border-gray-900"></span>
                          )}
                        </button>
                        {/* Mobile Tooltip */}
                        <AnimatePresence>
                          {isMobileUserTooltipOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute top-full right-0 mt-2 px-4 py-3 bg-white/95 backdrop-blur-2xl backdrop-saturate-150 dark:bg-gray-900/95 dark:backdrop-blur-2xl dark:backdrop-saturate-50 text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 whitespace-nowrap z-50"
                            >
                              <div className="font-semibold text-base">{user.first_name} {user.last_name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.email}</div>
                              <div className="text-sm text-[#1FBBD2] font-medium capitalize mt-1">{user.role}</div>
                              <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/95 dark:border-b-gray-900/95"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(!isMobileMenuOpen);
                        setIsMobileUserTooltipOpen(false);
                      }}
                      className="p-2 rounded-full text-gray-700 dark:text-gray-300"
                      aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* POWER YOUR PROJECT - DESKTOP */}
          <Link 
                            to="/get-started" 
            className="hidden xl:inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full text-white bg-[#1FBBD2] hover:bg-[#1A9DAA] transition-colors duration-300 flex-shrink-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FBBD2]"
          >
            Power Your Project
          </Link>
          <div className="hidden xl:block">
            <ThemeToggle />
          </div>
        </div>
        
        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="absolute top-full left-0 right-0 mt-2 xl:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/60 mx-4"
            >
              <div className="pt-5 pb-6 px-5">
                <div className="mt-6">
                  <nav className="grid gap-y-2">
                    <MobileNavLink to="/about" onClick={closeMobileMenu}>About</MobileNavLink>
                    
                    {/* Mobile Services Accordion */}
                    <div className="relative">
                      <button 
                        onClick={() => setMobileServicesOpen(!isMobileServicesOpen)}
                        className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#1FBBD2] dark:hover:text-[#1FBBD2] transition-colors duration-200"
                      >
                        Services
                        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-cyan-500/50 ml-4 py-2">
                          {serviceCategories.length > 0 ? (
                            Object.values(serviceCategories).map((category: any) => (
                              <MobileNavLink key={category.name} to={`/services?category=${category.slug}`} onClick={closeMobileMenu}>
                                {category.name}
                              </MobileNavLink>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading services...</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <MobileNavLink to="/portfolio" onClick={closeMobileMenu}>Portfolio</MobileNavLink>
                    <MobileNavLink to="/contact" onClick={closeMobileMenu}>Contact</MobileNavLink>
                    {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
                      <MobileNavLink to="/admin/dashboard" onClick={closeMobileMenu}>Dashboard</MobileNavLink>
                    )}
                  </nav>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-600 dark:text-gray-400">Theme</p>
                    <ThemeToggle />
                  </div>
                  {/* CLICKCRM BUTTON - MOBILE */}
                  <a
                    href="https://crm.clickbit.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="mt-6 block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#1FBBD2] hover:bg-[#1c9aa8]"
                  >
                    ClickCRM
                  </a>

                  {!isLoading && (
                    isAuthenticated ? (
                      <button
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="mt-4 block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-500 hover:bg-red-600"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="mt-4 block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#F39C12] hover:bg-[#E67E22]"
                      >
                        Login
                      </Link>
                    )
                  )}
                  <Link
                    to="/get-started"
                    onClick={closeMobileMenu}
                    className="mt-4 block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#1FBBD2] hover:bg-[#1A9DAA]"
                  >
                    Power Your Project
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Full-screen Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="flex items-center p-6">
                  <div className="flex items-center w-full bg-gray-50 dark:bg-gray-700 rounded-full px-6 py-4 border border-gray-200 dark:border-gray-600 focus-within:border-[#1FBBD2] dark:focus-within:border-[#1FBBD2] transition-colors">
                    <Search className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search services, pages, team members..."
                      className="w-full bg-transparent focus:outline-none text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-2 flex-shrink-0"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    <ul className="space-y-2">
                      {filteredResults.map((item: any, index) => (
                        <li key={`${item.name}-${index}`}>
                          <Link 
                            to={item.href}
                            onClick={() => setIsSearchOpen(false)}
                            className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="mr-4">
                                <span className="text-xs uppercase font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                  {item.type}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                {item.desc && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.desc}</p>}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery.trim().length > 0 ? "No results found." : "Start typing to search."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;