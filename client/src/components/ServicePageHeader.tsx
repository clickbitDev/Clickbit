import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ServicePageHeaderProps {
  title: string;
  image: string;
  slug: string;
}

const ServicePageHeader: React.FC<ServicePageHeaderProps> = ({ title, image, slug }) => {
  return (
    <div 
      className="relative bg-gray-900 text-white pt-48 pb-24 -mt-24" // Full-width hero section
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="w-full h-full"
          style={{ backgroundImage: `url('/images/patterns/page-header-bg.svg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.div 
          className="inline-block mt-6 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="hover:text-cyan-400 transition-colors">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-cyan-400">{title}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePageHeader; 