import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star } from 'lucide-react';
import InteractiveCard from './InteractiveCard';

const cardData = [
  {
    id: 'dedicated',
    type: 'pattern',
    pattern: '/images/patterns/showcase-pattern-1.svg',
    layoutClassName: 'lg:col-span-2',
    styleClassName: '',
    content: (
      <div className="p-6 h-full flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white">Driven by Excellence</h3>
        <p className="text-white/80 mt-1 text-sm max-w-sm">Our commitment to excellence is unwavering. We meticulously craft every detail, from the first line of code to the final pixel.</p>
      </div>
    )
  },
  {
    id: 'projects',
    type: 'default',
    layoutClassName: '',
    styleClassName: 'bg-[#112240]',
    content: (
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <Star className="w-8 h-8 text-[#F39C12]" />
          <h3 className="text-lg font-bold text-white mt-3">Proven Track Record</h3>
        </div>
        <p className="text-white/60 text-sm">Over 350+ successful projects delivered, showcasing our commitment to quality and client satisfaction.</p>
      </div>
    )
  },
  {
    id: 'brand',
    type: 'brand',
    layoutClassName: 'lg:row-span-2 h-full',
    styleClassName: 'bg-gradient-to-br from-gray-800 to-gray-900',
    content: (
      <div className="h-full flex flex-col justify-center items-center text-center p-6">
        <img src="/images/logos/logo-full-dark.png" alt="ClickBit Logo" className="w-32 mb-4" />
        <h3 className="text-xl font-bold text-white">Your Digital Partner</h3>
        <p className="text-white/70 mt-2 text-sm">From concept to conversion, we're with you every step of the way.</p>
      </div>
    )
  },
  {
    id: 'strategy',
    type: 'pattern',
    pattern: '/images/patterns/showcase-pattern-2.svg',
    layoutClassName: 'lg:col-span-2',
    styleClassName: '',
    content: (
      <div className="p-6 h-full flex flex-col justify-center">
        <h3 className="text-xl font-bold text-white">Future-Forward Technology</h3>
        <p className="text-white/80 mt-1 text-sm max-w-sm">We harness the latest in web technology to create solutions that are not just current, but years ahead.</p>
      </div>
    )
  },
  {
    id: 'team2',
    type: 'gradient',
    layoutClassName: '',
    styleClassName: 'bg-gradient-to-br from-[#1FBBD2] to-[#1c9aa8]',
    content: (
      <div className="p-6 h-full flex flex-col justify-between text-white">
        <Users className="w-8 h-8" />
        <div>
          <h3 className="text-xl font-bold">Client-Centric Approach</h3>
          <p className="mt-2 opacity-80 text-sm">Your success is our priority. We work closely with you to ensure we meet your goals.</p>
        </div>
      </div>
    )
  },
];

const ShowcaseGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-100 dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 auto-rows-fr gap-6">
          {cardData.map((card, index) => (
            <InteractiveCard 
              key={card.id} 
              className={`${card.layoutClassName} h-full ${index >= 4 ? 'hidden lg:block' : ''}`}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden relative group min-h-[240px] h-full ${card.styleClassName}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {card.type === 'pattern' && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${card.pattern})` }}
                  />
                )}
                {(card.type === 'pattern' || card.type === 'gradient' || card.type === 'brand') && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                )}
                <div className="relative h-full">
                  {card.content}
                </div>
              </motion.div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseGrid;