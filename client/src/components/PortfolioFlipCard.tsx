import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url?: string;
  cover_image?: string;
  featured_image?: string;
  description: string;
  short_description?: string;
  externalUrl?: string;
  live_url?: string;
  tags: string[];
  featured?: boolean;
  slug?: string;
}

interface PortfolioFlipCardProps {
  item: PortfolioItem;
  onClick?: (item: PortfolioItem) => void;
}

const PortfolioFlipCard: React.FC<PortfolioFlipCardProps> = ({ item, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleCardClick = () => {
    if (item.short_description) {
      setIsFlipped(!isFlipped);
    } else if (onClick) {
      onClick(item);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    if (item.slug) {
      window.location.href = `/portfolio/${item.slug}`;
    }
  };

  const imageUrl = item.featured_image || item.cover_image || item.image_url || '/images/work/project1.jpg';

  return (
    <div className="relative w-full h-80 perspective-1000">
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={handleCardClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side - Image and Title */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg group"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <LazyImage
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-semibold mb-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-200 text-sm">
                {item.category}
              </p>
              {item.short_description && (
                <p className="text-gray-300 text-xs mt-2 opacity-75">
                  Click to see description
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back Side - Short Description */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg flex items-center justify-center p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold mb-4 leading-tight">
              {item.title}
            </h3>
            
            {item.short_description ? (
              <p className="text-gray-100 leading-relaxed mb-4">
                {item.short_description}
              </p>
            ) : (
              <p className="text-gray-300 leading-relaxed mb-4">
                {item.description?.slice(0, 150)}...
              </p>
            )}
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {item.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="space-y-3">
              {item.slug && (
                <button
                  onClick={handleViewDetails}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/20"
                >
                  View Full Details
                </button>
              )}
              <p className="text-gray-300 text-xs">
                Click card to flip back
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortfolioFlipCard;
