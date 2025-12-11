import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, pageTransition } from '../animations';

const Error503Page = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-503" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-503)" className="text-gray-200 dark:text-gray-800"/>
          </svg>
        </div>
        
        {/* Floating 503 Elements */}
        <div className="absolute top-1/4 left-8 text-xs text-blue-500/30 dark:text-blue-400/30 font-mono animate-bounce" style={{ animationDelay: '0.5s' }}>
          503
        </div>
        <div className="absolute top-1/3 right-12 text-xs text-purple-500/30 dark:text-purple-400/30 font-mono animate-bounce" style={{ animationDelay: '1.5s' }}>
          Maintenance
        </div>
        <div className="absolute bottom-1/3 left-16 text-xs text-indigo-500/30 dark:text-indigo-400/30 font-mono animate-bounce" style={{ animationDelay: '2.5s' }}>
          Coming Back Soon
        </div>
        
        {/* Animated Lines */}
        <div className="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-24 h-px bg-gradient-to-l from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-0 w-40 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Particle Effect */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 dark:bg-blue-300/30 rounded-full animate-ping"
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

      <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Large 503 Number */}
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text drop-shadow-lg mb-4">
            503
          </div>
          
          {/* Animated Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="inline-block mb-6"
          >
            <svg className="w-24 h-24 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100"
        >
          Service Temporarily Unavailable
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          We're currently performing some maintenance to improve your experience. 
          We'll be back online shortly. Thank you for your patience!
        </motion.p>

        {/* Maintenance Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Maintenance in Progress</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1FBBD2] hover:bg-[#1A9DAA] text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
          <Link
            to="/contact"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contact Support
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Follow us on <a href="#" className="text-[#1FBBD2] hover:underline">social media</a> for updates</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Error503Page; 