import React from 'react';
import { useContent } from '../contexts/ContentContext';

const DynamicRibbon: React.FC = () => {
  const { getContent } = useContent();
  
  // Get dynamic content with fallback
  const text = getContent('home', 'ribbon', 'text') || 'Creative Solutions / Data-Driven Results / Web Development / Digital Marketing /';
  const repeatedText = Array(10).fill(text).join(' ');

  const RibbonContent = ({ reverse = false }: { reverse?: boolean }) => (
    <div className={`flex ${reverse ? 'animate-marquee-reverse-mobile md:animate-marquee-reverse' : 'animate-marquee-mobile md:animate-marquee'}`}>
        <div className="flex-shrink-0 whitespace-nowrap py-2 md:py-4">
            <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 px-2 md:px-4">{repeatedText}</span>
        </div>
        <div className="flex-shrink-0 whitespace-nowrap py-2 md:py-4">
            <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 px-2 md:px-4">{repeatedText}</span>
        </div>
    </div>
  );

  return (
    <div className="relative flex items-center justify-center w-full overflow-x-hidden h-32 sm:h-40 md:h-48 lg:h-60">
      {/* Ribbon 1: Top-left to bottom-right */}
      <div className="absolute w-[120%] sm:w-[130%] md:w-[150%] transform -rotate-2 md:-rotate-3 bg-gradient-to-r from-yellow-300 via-green-300 to-cyan-400 overflow-hidden">
          <RibbonContent />
      </div>

      {/* Ribbon 2: Bottom-left to top-right */}
      <div className="absolute w-[120%] sm:w-[130%] md:w-[150%] transform rotate-2 md:rotate-3 bg-gradient-to-r from-cyan-400 via-green-300 to-yellow-300 overflow-hidden">
        <RibbonContent reverse />
      </div>
    </div>
  );
};

export default DynamicRibbon;
