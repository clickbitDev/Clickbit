import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import { redirectTo403, redirectTo404, redirectTo503 } from '../utils/errorHandler';

const ErrorTestPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">
            Error Pages Test
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            This page allows you to test the different error pages. Click the buttons below to see how each error page looks.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={redirectTo404}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Test 404 Page
            </button>
            
            <button
              onClick={redirectTo403}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Test 403 Page
            </button>
            
            <button
              onClick={redirectTo503}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Test 503 Page
            </button>
          </div>
          
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Error Page Features:</h3>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Beautiful animated backgrounds with floating elements</li>
              <li>• Responsive design that works on all devices</li>
              <li>• Dark mode support</li>
              <li>• Smooth page transitions and animations</li>
              <li>• Helpful navigation options (Go Home, Go Back, etc.)</li>
              <li>• Consistent branding with your site's design</li>
              <li>• Automatic redirects for API errors (403, 404, 503)</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorTestPage; 