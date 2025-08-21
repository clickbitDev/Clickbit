import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveCard from './InteractiveCard';
import { useCart } from '../contexts/CartContext';

export interface PricingTier {
  name: string;
  subtitle: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  isPopular?: boolean;
}

interface PricingSectionProps {
  pricing: {
    superTitle: string;
    title: string;
    tiers: PricingTier[];
    serviceSlug: string;
  };
}

// Minimum quantities for printing services
const PRINTING_MIN_QUANTITIES: { [key: string]: number } = {
  'business-cards': 500,
  'flyers': 500,
  'brochures': 500,
  'banners': 1,
  'pull-up-banners': 1,
  'letterheads': 500,
  'posters': 100,
  'vehicle-wraps': 1,
};

const getMinQuantity = (tierName: string): number => {
  return PRINTING_MIN_QUANTITIES[tierName.toLowerCase().replace(/\s+/g, '-')] || 1;
};

// Utility function to determine if a pricing tier should go to cart or Power Your Project
const getPricingAction = (tier: PricingTier) => {
  // Extract numeric price from string (remove $, commas, and "From")
  const priceStr = tier.price.replace(/[$,]/g, '').replace(/from\s+/i, '');
  const price = parseFloat(priceStr);
  
  // Check if it's a custom quote
  const isCustom = tier.price.toLowerCase().includes('custom') || tier.price.toLowerCase().includes('quote');
  
  // If custom or price > $1,500 AUD, go to Power Your Project
  if (isCustom || !(price && price <= 1500)) {
    return {
              type: 'get-started' as const,
        href: '/get-started',
      text: isCustom ? 'Get Custom Quote' : 'Get Started'
    };
  }
  
  // If price is <= $1,500 AUD, go to cart
  return {
    type: 'cart' as const,
    href: `/cart?service=${tier.name.toLowerCase().replace(/\s+/g, '-')}`,
    text: 'Add to Cart'
  };
};

// Notification component
const Notification: React.FC<{ message: string; isVisible: boolean; onClose: () => void }> = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm"
        >
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const cardVariants = {
  rest: {
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  hover: {
    y: -10,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

// Helper function to format the price for display
const formatDisplayPrice = (priceStr: string) => {
  // If price is "Custom" or similar, return as is
  if (isNaN(parseFloat(priceStr.replace(/[$,]/g, '')))) {
    return priceStr;
  }
  // Otherwise, format as Australian Dollars
  const cleanedPrice = priceStr.replace(/from\s+/i, '').trim();
  return `A${cleanedPrice}`;
};



const PricingSection: React.FC<PricingSectionProps> = ({ pricing }) => {
  const navigate = useNavigate();
  const { addItemByServiceAndTier } = useCart();
  const [notification, setNotification] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const showNotification = (message: string) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handlePricingClick = (tier: PricingTier, serviceSlug: string) => {
    const action = getPricingAction(tier);
    const tierName = tier.name;
    const minQuantity = getMinQuantity(tierName.toLowerCase().replace(/\s+/g, '-'));



    if (action.type === 'cart') {
      
      addItemByServiceAndTier(serviceSlug, tierName, minQuantity);
      showNotification(`${tierName} has been added to cart!`);
      
    } else {
      navigate(action.href);
    }
  };

  return (
    <>
      <Notification 
        message={notification.message} 
        isVisible={notification.isVisible} 
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))} 
      />
      
      <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-lg font-semibold text-cyan-500 uppercase tracking-wider">{pricing.superTitle}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
              {pricing.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {pricing.tiers && pricing.tiers.length > 0 ? pricing.tiers.map((tier) => {
              const action = getPricingAction(tier);
              return (
                <motion.div
                  key={tier.name}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  className={`relative border rounded-2xl p-8 h-full flex flex-col transition-shadow duration-300 ${
                    tier.isPopular 
                      ? 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/10' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20'
                  } hover:shadow-2xl`}
                >
                  {tier.isPopular && (
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1 bg-cyan-500 text-white text-sm font-semibold rounded-full shadow-md">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div
                    className="h-full flex flex-col"
                  >
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 mb-6">{tier.subtitle}</p>
                      
                      <div className="flex items-baseline mb-8">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                          {formatDisplayPrice(tier.price)}
                        </span>
                        {tier.priceSuffix && <span className="text-xl font-semibold text-gray-500 dark:text-gray-400 ml-1">{tier.priceSuffix}</span>}
                      </div>

                      <ul className="space-y-4">
                        {tier.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <Check className="w-5 h-5 text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-10">
                      <button 
                        onClick={() => handlePricingClick(tier, pricing.serviceSlug)}
                        className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm transition-all duration-300 group ${
                          action.type === 'cart'
                            ? 'bg-[#F39C12] text-white hover:bg-[#E67E22]'
                            : tier.isPopular 
                              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {action.type === 'cart' && <ShoppingCart className="w-5 h-5 mr-2" />}
                        {action.text}
                        <ArrowRight className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No pricing tiers available for this service.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingSection;