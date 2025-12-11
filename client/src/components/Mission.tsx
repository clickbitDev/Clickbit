import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import {
  Users,
  Handshake,
  Gem,
  Target,
  BookCopy,
  ShieldAlert,
  LifeBuoy,
  FileText
} from 'lucide-react';

// Icon mapping for dynamic icon loading
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Users,
  Handshake,
  Gem,
  Target,
  BookCopy,
  ShieldAlert,
  LifeBuoy,
  FileText
};

const Mission = () => {
  const { getContent, missionPoints } = useContent();
  
  // Get dynamic content with fallbacks
  const missionTitle = getContent('home', 'mission', 'title') || 'Our Mission:';
  const missionHighlight = getContent('home', 'mission', 'highlight') || 'Your Growth';



  // Use dynamic mission points if available, otherwise fall back to default
  const defaultMissionPoints = [
    {
      icon: 'Users',
      title: 'Customer Centric',
      description: 'Personalized services that cater to your specific needs, ensuring that our solutions fit your business perfectly.',
    },
    {
      icon: 'Handshake',
      title: 'Collaborative Partnership',
      description: 'We work alongside you, maintaining open communication to fully understand your vision and incorporate your feedback into our strategies.',
    },
    {
      icon: 'Gem',
      title: 'Commitment to Quality',
      description: 'Our expert team stays updated on industry trends, delivering innovative solutions with a strong focus on quality.',
    },
    {
      icon: 'Target',
      title: 'Achieving Goals Together',
      description: 'We measure our success by your results. Your achievements are milestones for us, and we celebrate every step forward together.',
    },
    {
      icon: 'BookCopy',
      title: 'Expertise in Multiple Areas',
      description: 'From web development to digital marketing and hardware support, our experienced team brings a wealth of knowledge to every project.',
    },
    {
      icon: 'ShieldAlert',
      title: 'Proactive Support, Not Just Reactive',
      description: 'Regular maintenance and monitoring. Preventive measures to avoid issues and ensure your systems are always running smoothly.',
    },
    {
      icon: 'LifeBuoy',
      title: 'Complete IT Support, Start to Finish',
      description: 'From initial planning and installation to ongoing maintenance and emergency repairs, we offer true end-to-end support.',
    },
    {
      icon: 'FileText',
      title: 'Honest, Transparent Pricing',
      description: 'Clear, straightforward pricing with no hidden fees or surprises. We believe in building trust through transparency.',
    },
  ];

  const displayMissionPoints = missionPoints.length > 0 ? missionPoints : defaultMissionPoints;

  return (
    <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {missionTitle}{' '}
            <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">
              {missionHighlight}
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our mission is simple — your growth is our success. We're not just here to deliver projects; we're here to build lasting partnerships. Curious about the people and passion behind ClickBIT? <Link to="/about" className="text-[#1FBBD2] hover:text-[#1A9DAA] font-semibold underline">Learn more about us</Link>.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {displayMissionPoints.map((point, index) => {
            const IconComponent = iconMap[point.icon] || Target;
            return (
              <motion.div
                key={index}
                className="group text-center bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-8 rounded-2xl shadow-md"
                initial={{ scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  mass: 0.5,
                }}
              >
                <motion.div
                  className="bg-[#F39C12] h-10 w-10 sm:h-14 sm:w-14 rounded-lg flex items-center justify-center mb-4 sm:mb-6 mx-auto"
                  initial={{ backgroundColor: '#F39C12' }}
                  whileHover={{ backgroundColor: '#F39C12' }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <motion.div
                    initial={{ color: '#111827' }}
                    whileHover={{ color: '#ffffff' }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <IconComponent size={20} className="sm:w-7 sm:h-7" />
                  </motion.div>
                </motion.div>
                <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-3 text-[#F39C12]">{point.title}</h3>
                <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
                  {point.description.includes('From web development to digital marketing and hardware support') ? (
                    <>
                      From web development to digital marketing and hardware support, our experienced team brings a wealth of knowledge to every project.
                    </>
                  ) : point.description.includes('From initial planning and installation to ongoing maintenance') ? (
                    <>
                      From initial planning and installation to ongoing maintenance and emergency repairs, we offer true end-to-end support.
                    </>
                  ) : (
                    point.description
                  )}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Mission; 