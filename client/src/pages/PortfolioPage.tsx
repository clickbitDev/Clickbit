import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import CTA from '../components/CTA';
import api from '../services/api';
import { ExternalLink } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  cover_image?: string;
  description: string;
  tags: string[];
  live_url?: string;
  externalUrl?: string;
  featured?: boolean;
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
          const portfolioData = itemsResponse.value.data.items || itemsResponse.value.data;
          const data: PortfolioItem[] = portfolioData.map((item: any) => ({
            ...item,
            tags: Array.isArray(item.technologies) ? item.technologies : (Array.isArray(item.tags) ? item.tags : []),
            cover_image: item.featured_image || item.cover_image || item.image_url,
            live_url: item.live_url || item.externalUrl,
          }));
          setItems(data);
        }
        
        // Handle categories - use dedicated endpoint if available, otherwise extract from items
        if (categoriesResponse.status === 'fulfilled' && categoriesResponse.value.data?.length > 0) {
          setCategories(categoriesResponse.value.data);
        } else if (itemsResponse.status === 'fulfilled') {
          // Fallback to extracting from items
          const portfolioData = itemsResponse.value.data.items || itemsResponse.value.data;
          const uniqueCategories = Array.from(new Set(portfolioData.map((item: any) => item.category).filter(Boolean))) as string[];
          setCategories(uniqueCategories);
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
              We take pride in our work. Check out our complete portfolio showcasing our expertise and commitment to delivering exceptional results.
            </p>

            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide py-2 px-4 md:px-0 md:justify-center">
                {['All', 'Featured', ...categories].map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 md:px-5 py-2 text-sm rounded-full font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      activeCategory === category
                        ? 'bg-[#1FBBD2] text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {/* Mobile scroll indicator */}
              <div className="flex justify-center mt-2 md:hidden">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
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
                  className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={() => handleImageClick(project)}
                >
                  {/* Main Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img 
                      src={project.cover_image || project.image_url || '/images/work/project1.jpg'} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      onError={(e) => {
                        e.currentTarget.src = '/images/work/project1.jpg';
                      }}
                    />
                  </div>

                  {/* Overlay with description */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#1FBBD2]">
                          {project.category}
                        </span>
                        {(project.externalUrl || project.live_url) && (
                          <ExternalLink className="h-4 w-4 text-white/80" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-sm text-white/90 line-clamp-2">{project.description}</p>
                      
                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {(project.externalUrl || project.live_url) ? (
                      <ExternalLink className="h-4 w-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
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