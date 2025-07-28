import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, pageTransition } from '../animations';

const Error404Page = () => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-404" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-404)" className="text-gray-200 dark:text-gray-800"/>
          </svg>
        </div>
        
        {/* Floating 404 Elements */}
        <div className="absolute top-1/4 left-8 text-xs text-red-500/30 dark:text-red-400/30 font-mono animate-bounce" style={{ animationDelay: '0.5s' }}>
          404
        </div>
        <div className="absolute top-1/3 right-12 text-xs text-orange-500/30 dark:text-orange-400/30 font-mono animate-bounce" style={{ animationDelay: '1.5s' }}>
          Not Found
        </div>
        <div className="absolute bottom-1/3 left-16 text-xs text-yellow-500/30 dark:text-yellow-400/30 font-mono animate-bounce" style={{ animationDelay: '2.5s' }}>
          Oops!
        </div>
        
        {/* Animated Lines */}
        <div className="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-24 h-px bg-gradient-to-l from-transparent via-orange-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-0 w-40 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Particle Effect */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-400/30 dark:bg-red-300/30 rounded-full animate-ping"
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
          {/* Large 404 Number */}
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg mb-4">
            404
          </div>
          
          {/* Animated Icon */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-6"
          >
            <svg className="w-24 h-24 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Oops! The page you're looking for seems to have wandered off into the digital wilderness. 
          Don't worry, we'll help you find your way back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="bg-[#1FBBD2] hover:bg-[#1A9DAA] text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Need help? <Link to="/contact" className="text-[#1FBBD2] hover:underline">Contact our support team</Link></p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Error404Page; 