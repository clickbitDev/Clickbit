import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { services, popularServices } from '../services/serviceData';
// TODO: Replace static data with API call to backend for services
import InteractiveCard from './InteractiveCard';
import { Link } from 'react-router-dom';
import { getServiceIcon } from '../services/SERVICE_ICONS_MAPPING';
import { ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';

// Debug: Print all top-level variables to check for accidental hoisting or shadowing
console.log('Services component loaded');

// Fallback static data in case API fails
const staticServices = [
  {
    id: 1,
    name: "Web Development",
    slug: "web-development",
    description: "Custom web applications and websites built with modern technologies.",
    category: "Development",
    isPopular: true
  },
  {
    id: 2,
    name: "Mobile Development",
    slug: "mobile-development", 
    description: "Native and cross-platform mobile applications for iOS and Android.",
    category: "Development",
    isPopular: true
  },
  {
    id: 3,
    name: "Cloud Solutions",
    slug: "cloud-solutions",
    description: "Cloud migration, setup, and management services.",
    category: "Infrastructure",
    isPopular: false
  }
];

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Popular');

  console.log('Services component render - services count:', services.length, 'activeCategory:', activeCategory); // DEBUG LOG

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/services');
        console.log('Fetched services data (homepage):', res.data); // DEBUG LOG
        console.log('First service isPopular value:', res.data[0]?.isPopular, typeof res.data[0]?.isPopular); // DEBUG LOG
        setServices(res.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching services');
        console.error('Service fetch error (homepage):', err); // DEBUG LOG
        // Use fallback data if API fails
        setServices(staticServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Compute categories from fetched services
  const categories = useMemo(() => {
    console.log('Services in categories useMemo (homepage):', services); // DEBUG LOG
    const cats = Array.from(new Set(services.map(s => s.category)));
    const result = ['Popular', 'All', ...cats.sort()];
    console.log('Computed categories (homepage):', result); // DEBUG LOG
    return result;
  }, [services]);

  // Compute popular services
  const popularServices = useMemo(() => {
    console.log('Services in popularServices useMemo (homepage):', services); // DEBUG LOG
    console.log('Services with isPopular field:', services.map(s => ({ name: s.name, isPopular: s.isPopular }))); // DEBUG LOG
    const popular = services.filter(s => s.isPopular);
    console.log('Popular services (homepage):', popular); // DEBUG LOG
    console.log('Popular services count:', popular.length); // DEBUG LOG
    console.log('All services count:', services.length); // DEBUG LOG
    return popular;
  }, [services]);

  // Filtered services by category
  const filteredServices = useMemo(() => {
    console.log('Services in filteredServices useMemo (homepage):', services); // DEBUG LOG
    console.log('Active category (homepage):', activeCategory); // DEBUG LOG
    console.log('Popular services count:', popularServices.length); // DEBUG LOG
    let result;
    if (activeCategory === 'All') {
      result = services;
    } else if (activeCategory === 'Popular') {
      result = popularServices;
      console.log('Filtering for Popular category, result:', result); // DEBUG LOG
    } else {
      result = services.filter(s => s.category === activeCategory);
    }
    console.log('Filtered services result (homepage):', result); // DEBUG LOG
    return result;
  }, [activeCategory, services, popularServices]);
  
  const getServiceItemClasses = (count: number, index: number): string => {
    // These rules apply only to large screens with a 3-column grid
    if (count === 4 && index === 3) {
      // For 4 items, center the last one
      return 'lg:col-start-2';
    }
    if (count === 5 && index === 4) {
      // For 5 items, move the last one to the 3rd column to create a gap
      return 'lg:col-start-3';
    }
    return '';
  };

  if (loading) return <div className="text-center py-16">Loading services...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  console.log('About to render - filteredServices:', filteredServices); // DEBUG LOG
  console.log('About to render - filteredServices length:', filteredServices.length); // DEBUG LOG

  return (
    <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Our <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">Services</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Comprehensive solutions to power your digital strategy.</p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                console.log('Category button clicked:', category); // DEBUG LOG
                setActiveCategory(category);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                activeCategory === category 
                ? 'bg-[#1FBBD2] text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            <AnimatePresence>
              {filteredServices.map((service: any, index: number) => (
                <motion.div
                  key={service.id || service.name}
                  className={getServiceItemClasses(filteredServices.length, index)}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Link to={service.href || `/services/${service.slug}`} className="block h-full">
                    <InteractiveCard>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-6 lg:p-8 rounded-2xl shadow-lg h-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            {React.createElement(getServiceIcon(service.slug), {
                              size: 20,
                              className: "text-[#1FBBD2] flex-shrink-0 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                            })}
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                {service.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                      </div>
                    </InteractiveCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No services available at the moment.</h3>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services; 