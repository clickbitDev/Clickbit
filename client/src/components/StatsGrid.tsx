import React from 'react';
import { useContent } from '../contexts/ContentContext';
import AnimatedNumber from './AnimatedNumber';

const StatItem = ({
  value,
  suffix,
  title,
  description,
}: {
  value: number;
  suffix: string;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <h2 className="text-8xl lg:text-9xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-300" style={{ lineHeight: '1' }}>
      <AnimatedNumber to={value} trigger="scroll" />
      <span className="text-7xl lg:text-8xl">{suffix}</span>
    </h2>
    <h3 className="mt-4 text-2xl font-bold text-cyan-400">{title}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
      {description}
    </p>
  </div>
);

const StatsGrid = () => {
  const { getContent } = useContent();
  
  // Get dynamic content with fallbacks
  const mainTitle = getContent('home', 'stats', 'main_title') || 'ClickBIT has helped';
  const mainNumber = parseInt(getContent('home', 'stats', 'main_number') || '350');
  const mainSuffix = getContent('home', 'stats', 'main_suffix') || '+ companies create and establish their digital presence';
  
  const satisfactionValue = parseInt(getContent('home', 'stats', 'satisfaction_value') || '95');
  const satisfactionTitle = getContent('home', 'stats', 'satisfaction_title') || 'Customer Satisfaction';
  const satisfactionDesc = getContent('home', 'stats', 'satisfaction_desc') || 'Achieved a 95% customer satisfaction rate across all projects.';
  
  const deliveryValue = parseInt(getContent('home', 'stats', 'delivery_value') || '14');
  const deliverySuffix = getContent('home', 'stats', 'delivery_suffix') || 'days';
  const deliveryTitle = getContent('home', 'stats', 'delivery_title') || 'Fast & Efficient';
  const deliveryDesc = getContent('home', 'stats', 'delivery_desc') || 'Delivering high-quality solutions within an optimized timeline, ensuring speed, precision, and maximum efficiency.';

  return (
    <div className="py-16 md:py-24 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {mainTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1FBBD2] to-[#F39C12]"><AnimatedNumber to={mainNumber} trigger="scroll" />{mainSuffix}</span>
          </h2>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 max-w-4xl">
            <StatItem
              value={satisfactionValue}
              suffix="%"
              title={satisfactionTitle}
              description={satisfactionDesc}
            />
            <StatItem
              value={deliveryValue}
              suffix={deliverySuffix}
              title={deliveryTitle}
              description={deliveryDesc}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid; 