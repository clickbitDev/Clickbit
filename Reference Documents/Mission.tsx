import React from 'react';
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

const missionPoints = [
  {
    icon: Users,
    title: 'Customer Centric',
    description: 'Personalized services that cater to your specific needs, ensuring that our solutions fit your business perfectly.',
  },
  {
    icon: Handshake,
    title: 'Collaborative Partnership',
    description: 'We work alongside you, maintaining open communication to fully understand your vision and incorporate your feedback into our strategies.',
  },
  {
    icon: Gem,
    title: 'Commitment to Quality',
    description: 'Our expert team stays updated on industry trends, delivering innovative solutions with a strong focus on quality.',
  },
  {
    icon: Target,
    title: 'Achieving Goals Together',
    description: 'We measure our success by your results. Your achievements are milestones for us, and we celebrate every step forward together.',
  },
  {
    icon: BookCopy,
    title: 'Expertise in Multiple Areas',
    description: 'From web development to digital marketing and hardware support, our experienced team brings a wealth of knowledge to every project.',
  },
  {
    icon: ShieldAlert,
    title: 'Proactive Support, Not Just Reactive',
    description: 'Regular maintenance and monitoring. Preventive measures to avoid issues and ensure your systems are always running smoothly.',
  },
  {
    icon: LifeBuoy,
    title: 'Complete IT Support, Start to Finish',
    description: 'From initial planning and installation to ongoing maintenance and emergency repairs, we offer true end-to-end support.',
  },
  {
    icon: FileText,
    title: 'Honest, Transparent Pricing',
    description: 'Clear, straightforward pricing with no hidden fees or surprises. We believe in building trust through transparency.',
  },
];

const Mission = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Our Mission:{' '}
            <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">
              Your Growth
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {missionPoints.map((point) => (
            <div key={point.title} className="group text-center bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-[#F39C12] h-10 w-10 sm:h-14 sm:w-14 rounded-lg flex items-center justify-center mb-4 sm:mb-6 mx-auto transition-colors duration-300">
                <point.icon size={20} className="sm:w-7 sm:h-7 text-gray-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-3 text-[#F39C12]">{point.title}</h3>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mission; 