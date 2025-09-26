import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import SiteHead from '../components/SiteHead';
import PageHeader from '../components/PageHeader';
import CTA from '../components/CTA';
import PortfolioFlipCard from '../components/PortfolioFlipCard';
import api from '../services/api';
import { ExternalLink } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url?: string;
  cover_image?: string;
  featured_image?: string;
  description: string;
  short_description?: string;
  tags: string[];
  live_url?: string;
  externalUrl?: string;
  featured?: boolean;
  slug?: string;
}

const PortfolioPage: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        
        // Fetch both items and categories in parallel
        const [itemsResponse, categoriesResponse] = await Promise.allSettled([
          api.get('/portfolio'),
          api.get('/portfolio/categories')
        ]);
        
        // Handle items
        if (itemsResponse.status === 'fulfilled') {
          const portfolioData = itemsResponse.value.data.items || [];
          
          // Defensive check: ensure portfolioData is an array
          if (Array.isArray(portfolioData)) {
            const data: PortfolioItem[] = portfolioData.map((item: any) => ({
              ...item,
              tags: Array.isArray(item.technologies) ? item.technologies : (Array.isArray(item.tags) ? item.tags : []),
              cover_image: item.featured_image || item.cover_image || item.image_url,
              live_url: item.live_url || item.externalUrl,
            }));
            setItems(data);
          } else {
            console.warn('Portfolio data is not an array:', portfolioData);
            setItems([]);
          }
        }
        
        // Handle categories - use dedicated endpoint if available, otherwise extract from items
        if (categoriesResponse.status === 'fulfilled' && categoriesResponse.value.data?.length > 0) {
          setCategories(categoriesResponse.value.data);
        } else if (itemsResponse.status === 'fulfilled') {
          // Fallback to extracting from items
          const portfolioData = itemsResponse.value.data.items || [];
          
          // Defensive check: ensure portfolioData is an array before mapping
          if (Array.isArray(portfolioData)) {
            const uniqueCategories = Array.from(new Set(portfolioData.map((item: any) => item.category).filter(Boolean))) as string[];
            setCategories(uniqueCategories);
          } else {
            console.warn('Portfolio data for categories is not an array:', portfolioData);
            setCategories([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch portfolio data:', err);
        setError('Our portfolio is currently offline for maintenance. Please check back later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const filteredItems = activeCategory === 'All'
    ? items
    : activeCategory === 'Featured'
    ? items.filter(item => item.featured)
    : items.filter(item => item.category === activeCategory);

  const handleImageClick = (item: PortfolioItem) => {
    if (item.externalUrl || item.live_url) {
      // Open external URL in new tab
      window.open(item.externalUrl || item.live_url, '_blank', 'noopener,noreferrer');
    } else {
      // Open lightbox
      setLightboxImage(item.cover_image || item.image_url || '/images/work/project1.jpg');
      setLightboxTitle(item.title);
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxTitle('');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <PageHeader 
          title="Our Work"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' }
          ]}
        />
        <div className="text-center py-20">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <PageHeader 
          title="Our Work"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' }
          ]}
        />
        <div className="text-center py-20 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <SiteHead 
        title="Our Work"
        description="Explore ClickBit's portfolio of successful projects. See our expertise in web development, custom applications, and digital solutions for businesses."
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-white dark:bg-gray-900 min-h-screen"
      >
        <PageHeader
          title="Our Work"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' }
          ]}
        />
        <div className="py-16">
          <div className="container mx-auto px-4">
            <p className="text-center text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              We take pride in projects powered by our <Link to="/services" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline font-medium">services</Link>. Check out our excellent <Link to="/about" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline font-medium">team</Link> and the complete portfolio they've crafted, showcasing our expertise and commitment to delivering exceptional results.
            </p>

            {/* Category Filter - Enhanced Responsive Design */}
            <div className="mb-12">
              <div className="relative">
                {/* Filter Container: mobile scroll, desktop wraps */}
                <div className="flex gap-2 md:gap-3 overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap px-4 md:px-0 justify-start md:justify-center py-2 scroll-smooth">
                  {['All', 'Featured', ...categories].map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 md:px-5 py-2 text-sm rounded-full font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 border-2 ${
                        activeCategory === category
                          ? 'bg-[#1FBBD2] text-white shadow-lg border-[#1FBBD2]'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {category}
                    </button>
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

            {/* Portfolio Gallery Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filteredItems.map((project) => (
                <motion.div 
                  key={project.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <PortfolioFlipCard 
                    item={project} 
                    onClick={handleImageClick}
                  />
                </motion.div>
              ))}
            </motion.div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No projects found for this category.</h3>
                <p className="text-gray-500 mt-2">Please check back later or select a different category.</p>
              </div>
            )}
          </div>
        </div>
        <CTA />
      </motion.div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={lightboxImage} 
              alt={lightboxTitle}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <ExternalLink className="h-6 w-6 transform rotate-45" />
            </button>
            {lightboxTitle && (
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <h3 className="text-xl font-bold">{lightboxTitle}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioPage; 