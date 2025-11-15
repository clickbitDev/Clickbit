import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Star, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const CTA: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 py-20 sm:py-28 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/work/project2.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"></div>

      {/* Floating Decorative Elements */}
      <motion.div 
        className="absolute top-10 left-10 text-gray-900/5 dark:text-white/10"
        animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Code size={64} />
      </motion.div>
      <motion.div 
        className="absolute bottom-10 right-10 text-gray-900/5 dark:text-white/10"
        animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star size={64} />
      </motion.div>
       <motion.div 
        className="absolute top-1/2 left-1/4 text-gray-900/5 dark:text-white/10"
        animate={{ y: [5, -5, 5], rotate: [5, -5, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Compass size={48} />
      </motion.div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          className="relative inline-flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Power Your Project
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-4 max-w-xl mx-auto text-lg">
            Let's turn your vision into a reality. Contact us today to discuss your ideas and discover how we can help you succeed.
          </p>
          <Link
            to="/contact"
            className="mt-8 group inline-flex items-center justify-center px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg rounded-full transition-all duration-300 ease-in-out shadow-2xl hover:shadow-cyan-500/40 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-6 h-6 ml-3 transform transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CTA; 