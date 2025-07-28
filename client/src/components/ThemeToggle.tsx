import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out
        ${theme === 'light' ? 'bg-cyan-500' : 'bg-gray-700'}
      `}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        className="w-6 h-6 bg-white rounded-full shadow-md"
        style={{
          position: 'absolute',
          left: theme === 'light' ? '0.25rem' : 'auto',
          right: theme === 'dark' ? '0.25rem' : 'auto',
        }}
      />
      <div className="flex justify-between w-full px-1">
        <Sun className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-yellow-400' : 'text-transparent'}`} />
        <Moon className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-white' : 'text-transparent'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle; 