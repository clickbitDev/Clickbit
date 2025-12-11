import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import LazyImage from './LazyImage';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url: string; // Corrected to match server data
  description: string;
  tags: string[];
  live_url?: string; // Corrected to match server data
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  categories: string[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, categories }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 justify-center">
            {['All', ...categories].map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 text-sm rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-[#1FBBD2] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
            >
              <div className="relative">
                <LazyImage 
                  src={item.image_url || '/images/placeholders/pattern.svg'} 
                  alt={item.title} 
                  className="w-full h-56 object-cover" 
                  placeholder="/images/placeholders/pattern.svg"
                  fallback="/images/placeholders/pattern.svg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.live_url && (
                    <a
                      href={item.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white flex items-center bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-full transition-colors text-sm font-semibold"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Project
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6">
                <span className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">{item.category}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioGrid; 