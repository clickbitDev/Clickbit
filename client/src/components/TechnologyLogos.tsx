import React, { useState, useEffect, useRef } from 'react';
import { softwareLogos } from '../services/TECHNOLOGY_LOGOS_DATA';

interface TechnologyLogosProps {
  serviceSlug: string;
}

const TechnologyLogos: React.FC<TechnologyLogosProps> = ({ serviceSlug }) => {
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const serviceLogos = softwareLogos[serviceSlug] || {};
  const logoEntries = Object.entries(serviceLogos);
  const duplicatedLogos = [...logoEntries, ...logoEntries];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || isHovered || logoEntries.length <= 5) return;

    // Cache scroll width to avoid repeated DOM measurements
    const scrollWidth = carousel.scrollWidth;
    const halfScrollWidth = scrollWidth / 2;
    
    let animationFrameId: number;
    const scroll = () => {
      carousel.scrollLeft += 0.5; // Adjust speed here
      if (carousel.scrollLeft >= halfScrollWidth) {
        carousel.scrollLeft = 0;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, logoEntries.length]);

  if (logoEntries.length === 0) {
    return null;
  }

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={carouselRef}
            className="flex gap-12 overflow-x-hidden"
          >
            {duplicatedLogos.map(([name, url], index) => (
              <div
                key={`${name}-${index}`}
                className="flex-shrink-0 w-28 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 transition-transform duration-300 transform hover:-translate-y-1">
                  <img 
                    src={url} 
                    alt={name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {name}
                </p>
              </div>
            ))}
          </div>

          {/* Gradient Fades */}
          <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent dark:from-gray-800 dark:via-gray-800/80 pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent dark:from-gray-800 dark:via-gray-800/80 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyLogos; 