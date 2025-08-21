import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import InteractiveCard from '../components/InteractiveCard';
import { getServiceIcon } from '../services/SERVICE_ICONS_MAPPING';
import api from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get category from URL params
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/services');

        setServices(res.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching services');
        console.error('Service fetch error:', err); // DEBUG LOG
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Update active category when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      const formattedCategory = categoryFromUrl
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/And/g, '&');
      setActiveCategory(formattedCategory);
    } else {
      setActiveCategory('All');
    }
  }, [categoryFromUrl]);

  // Compute categories from fetched services
  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map(s => s.category)));
    const result = ['Popular', ...cats.sort()];
    return result;
  }, [services]);

  // Compute popular services (max 9)
  const popularServices = useMemo(() => {
    const popular = services.filter(s => s.isPopular).slice(0, 9);
    return popular;
  }, [services]);

  // Filtered services by category
  const filteredServices = useMemo(() => {
    let result;
    if (activeCategory === 'All') {
      result = services;
    } else if (activeCategory === 'Popular') {
      result = popularServices;
    } else {
      result = services.filter(s => s.category === activeCategory);
    }
    return result;
  }, [activeCategory, services, popularServices]);

  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-white dark:bg-gray-900"
      >
        <PageHeader 
          title="Our Services" 
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Services', href: '/services' }
          ]} 
        />
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FBBD2]"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-white dark:bg-gray-900"
      >
        <PageHeader 
          title="Our Services" 
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Services', href: '/services' }
          ]} 
        />
        <div className="text-center py-20 text-red-500">{error}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-white dark:bg-gray-900"
    >
      <PageHeader 
        title="Our Services" 
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' }
        ]} 
      />
      <div className="py-16">
        <div className="container mx-auto px-4">
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Explore our comprehensive range of services designed to help your business grow and succeed in the digital landscape.
          </p>
          
          {/* Category Filter - Enhanced Responsive Design */}
          <div className="mb-12">
            <div className="relative">
              {/* Filter Container: mobile scroll, desktop wraps */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap justify-start md:justify-center px-2 md:px-0 py-2 scroll-smooth">
                <Link
                  to="/services"
                  onClick={() => setActiveCategory('All')}
                  className={`px-4 md:px-5 py-2 text-sm rounded-full font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 border-2 ${
                    activeCategory === 'All'
                      ? 'bg-[#1FBBD2] text-white shadow-lg border-[#1FBBD2]'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  All Services
                </Link>
                {categories.map(category => (
                  <Link
                    key={category}
                    to={`/services?category=${category.toLowerCase().replace(/\s+&\s+/g, '-and-').replace(/\s+/g, '-')}`}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 md:px-5 py-2 text-sm rounded-full font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 border-2 ${
                      activeCategory === category
                        ? 'bg-[#1FBBD2] text-white shadow-lg border-[#1FBBD2]'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
              
              {/* Scroll Indicators */}
              <div className="flex justify-center mt-3 md:hidden">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#1FBBD2] rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Filter Instructions */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 md:hidden">
                Swipe to see more categories
              </p>
            </div>
          </div>

          {/* Services Grid with Animation */}
          {filteredServices.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredServices.map((service: any) => (
                <motion.div
                  key={service.id || service.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <InteractiveCard>
                    <Link to={service.href || `/services/${service.slug}`} className="block h-full">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-full flex flex-col border border-gray-200 dark:border-gray-700 hover:border-[#1FBBD2] dark:hover:border-[#1FBBD2] transition-all duration-300 group hover:shadow-lg">
                        <div className="mb-4">
                          {React.createElement(getServiceIcon(service.slug, service.name, service.category), {
                            className: "w-12 h-12 text-[#1FBBD2]"
                          })}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#1FBBD2] transition-colors">{service.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </Link>
                  </InteractiveCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No services found for this category.</h3>
              <p className="text-gray-500 mt-2">Please check back later or select a different category.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesPage; 