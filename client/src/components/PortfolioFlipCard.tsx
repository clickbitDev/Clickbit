import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on a button or link, don't flip/navigate
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    // If there's a short_description, flip the card to show it
    if (item.short_description) {
      setIsFlipped(!isFlipped);
      return;
    }

    // If there's a slug but no short_description, navigate directly
    if (item.slug) {
      navigate(`/portfolio/${item.slug}`);
      return;
    }

    // Otherwise, use the onClick handler if provided
    if (onClick) {
      onClick(item);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    if (item.slug) {
      navigate(`/portfolio/${item.slug}`);
    }
  };

  const handleFlipCard = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    if (item.short_description) {
      setIsFlipped(!isFlipped);
    }
  };

  const imageUrl = item.featured_image || item.cover_image || item.image_url || '/images/placeholders/pattern.jpg';

  return (
    <div className="relative w-full h-80 perspective-1000">
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 0.5
        }}
        onClick={handleCardClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side - Image and Title */}
        <motion.div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg group"
          style={{ backfaceVisibility: 'hidden' }}
          whileHover="hover"
          initial="initial"
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.5
            }}
          >
            <LazyImage
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              fallback="/images/placeholders/pattern.jpg"
              placeholder="/images/placeholders/pattern.jpg"
            />
          </motion.div>
          
          {/* Overlay with title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-semibold mb-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-200 text-sm">
                {item.category}
              </p>
              {item.short_description ? (
                <p className="text-gray-300 text-xs mt-2 opacity-75">
                  Click to see description
                </p>
              ) : item.slug ? (
                <p className="text-gray-300 text-xs mt-2 opacity-75">
                  Click anywhere to view details
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>

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
                <Link
                  to={`/portfolio/${item.slug}`}
                  onClick={handleViewDetails}
                  className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out backdrop-blur-sm border border-white/20"
                >
                  View Full Details
                </Link>
              )}
              {item.short_description && (
                <button
                  onClick={handleFlipCard}
                  className="text-gray-300 text-xs hover:text-white transition-all duration-300 ease-in-out"
                >
                  Click here to flip back
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortfolioFlipCard;
