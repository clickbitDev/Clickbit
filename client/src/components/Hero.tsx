import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

const Hero = () => {
  const { getContent } = useContent();
  
  // Get dynamic content with fallbacks
  const heroTitle = getContent('home', 'hero', 'title') || 'Inspired by Creativity, Driven by Conversions';
  const heroSubtitle = getContent('home', 'hero', 'subtitle') || 'At ClickBit, we craft amazing websites, data-backed marketing campaigns, and cutting-edge design assets that turn clicks into customers.';
  const heroCtaText = getContent('home', 'hero', 'cta_text') || 'Start Your Project';

  return (
    <div 
      className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-20 md:py-32 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-200 dark:text-gray-800"/>
          </svg>
        </div>
        
        {/* Floating Code Elements */}
        <div className="absolute top-1/4 left-8 text-xs text-cyan-500/30 dark:text-cyan-400/30 font-mono animate-bounce" style={{ animationDelay: '0.5s' }}>
          &lt;div&gt;
        </div>
        <div className="absolute top-1/3 right-12 text-xs text-blue-500/30 dark:text-blue-400/30 font-mono animate-bounce" style={{ animationDelay: '1.5s' }}>
          {`{code}`}
        </div>
        <div className="absolute bottom-1/3 left-16 text-xs text-purple-500/30 dark:text-purple-400/30 font-mono animate-bounce" style={{ animationDelay: '2.5s' }}>
          &lt;/div&gt;
        </div>
        <div className="absolute bottom-1/4 right-8 text-xs text-green-500/30 dark:text-green-400/30 font-mono animate-bounce" style={{ animationDelay: '0.8s' }}>
          function()
        </div>
        <div className="absolute top-3/4 left-1/2 text-xs text-orange-500/30 dark:text-orange-400/30 font-mono animate-bounce" style={{ animationDelay: '1.2s' }}>
          ...props
        </div>
        
        {/* Animated Lines */}
        <div className="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-24 h-px bg-gradient-to-l from-transparent via-blue-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-0 w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-1/4 text-cyan-400/20 dark:text-cyan-300/20 animate-float">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="absolute top-1/2 right-1/4 text-blue-400/20 dark:text-blue-300/20 animate-float" style={{ animationDelay: '1s' }}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-1/3 text-purple-400/20 dark:text-purple-300/20 animate-float" style={{ animationDelay: '2s' }}>
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
          </svg>
        </div>
        
        {/* Particle Effect */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 dark:bg-cyan-300/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text drop-shadow-lg"
          dangerouslySetInnerHTML={{ __html: heroTitle.replace(/,\s*<br\s*\/?>/g, ',<br />').replace(/\n/g, '<br />') }}
        />
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mt-6 max-w-2xl mx-auto text-gray-700 dark:text-gray-200 drop-shadow-lg"
        >
          {heroSubtitle}
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Link
            to="/services"
            className="bg-[#1FBBD2] hover:bg-[#1A9DAA] text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {heroCtaText}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 