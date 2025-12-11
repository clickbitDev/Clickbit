import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, Target, Sparkles } from 'lucide-react';
type ContentSectionType = any;
// TODO: Replace static data with API call to backend for service details

interface ServiceSectionGridProps {
  sections: ContentSectionType[];
}

const iconMap: { [key: string]: React.ReactNode } = {
  'Core Features': <Zap className="w-7 h-7" />,
  'Use Cases': <Target className="w-7 h-7" />,
  'Our Process': <CheckCircle className="w-7 h-7" />,
  'Why Choose Us': <Sparkles className="w-7 h-7" />,
  'Crafting Digital Experiences That Drive Results': <Sparkles className="w-7 h-7" />,
  'Why Choose ClickBit for Your Website Development?': <CheckCircle className="w-7 h-7" />,
  'Our Development Process': <Target className="w-7 h-7" />,
  'Technologies We Use': <Zap className="w-7 h-7" />,
  // Add other specific titles from other services here if needed
};

const ServiceSectionGrid: React.FC<ServiceSectionGridProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const handleInteraction = (index: number | null) => {
    setActiveSection(index);
  };

  const handleClick = (index: number) => {
    setActiveSection(prev => prev === index ? null : index);
  }

  // Function to determine grid position for diagonal layout
  const getGridPosition = (index: number, hasList: boolean) => {
    if (sections.length !== 4) {
      // If not exactly 4 sections, use default grid order
      return '';
    }

    // For 4 sections, arrange sections with lists diagonally (only on md+ screens)
    if (hasList) {
      // First section with list goes to top-left (0), second goes to bottom-right (3)
      const listSections = sections.map((section, i) => ({ index: i, hasList: !!section.list })).filter(item => item.hasList);
      const listIndex = listSections.findIndex(item => item.index === index);
      return listIndex === 0 ? 'md:col-start-1 md:row-start-1' : 'md:col-start-2 md:row-start-2';
    } else {
      // Sections without lists fill the remaining positions
      const nonListSections = sections.map((section, i) => ({ index: i, hasList: !!section.list })).filter(item => !item.hasList);
      const nonListIndex = nonListSections.findIndex(item => item.index === index);
      return nonListIndex === 0 ? 'md:col-start-2 md:row-start-1' : 'md:col-start-1 md:row-start-2';
    }
  };

  return (
    <div className="py-16 md:py-24 bg-gray-50 dark:bg-black/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section: any, index: any) => (
            <motion.div
              key={index}
              className={`relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8 flex flex-col transition-all duration-500 ease-out overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] hover:bg-white dark:hover:bg-gray-800 ${getGridPosition(index, !!section.list)}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              onHoverStart={() => handleInteraction(index)}
              onHoverEnd={() => handleInteraction(null)}
              onClick={() => handleClick(index)}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gray-800 dark:bg-gray-900 rounded-xl text-cyan-400 shadow-md border border-gray-100 dark:border-gray-700/50">
                    {iconMap[section.title] || <Sparkles className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="ml-5 text-2xl font-bold text-gray-800 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                
                <div className="flex-grow text-gray-600 dark:text-gray-400">
                  <p>
                    {section.paragraphs[0]}
                  </p>
                </div>
                
                <AnimatePresence>
                  {activeSection === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        {section.paragraphs.slice(1).map((p: any, i: any) => (
                          <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 last:mb-0">
                            {p}
                          </p>
                        ))}
                        {section.list && (
                          <ul className="space-y-3 mt-6">
                            {section.list.map((item: any, i: any) => (
                              <motion.li 
                                key={i} 
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                              >
                                <CheckCircle className="w-5 h-5 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSectionGrid; 