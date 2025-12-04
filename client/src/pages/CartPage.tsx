import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, CreditCard, Plus, Minus, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Define minimum quantities for printing services
// Keys can match: product slug (e.g., "printing-business-cards"), tier name (e.g., "Business Cards"), or simplified key (e.g., "business-cards")
const PRINTING_MIN_QUANTITIES: { [key: string]: number } = {
  // Product slugs (from product mapping)
  'printing-business-cards': 500,
  'printing-flyers': 500,
  'printing-brochures': 500,
  'printing-banners': 1, // per sqm
  'printing-pull-up-banners': 1,
  'printing-letterheads': 500,
  'printing-posters': 100,
  'printing-vehicle-wraps': 1, // per sqm
  // Tier names (for matching by name)
  'Business Cards': 500,
  'Flyers': 500,
  'Brochures': 500,
  'Banners': 1,
  'Pull-up Banners': 1,
  'Letterheads': 500,
  'Posters': 100,
  'Vehicle Wraps': 1,
  // Simplified keys (fallback)
  'business-cards': 500,
  'flyers': 500,
  'brochures': 500,
  'banners': 1,
  'pull-up-banners': 1,
  'letterheads': 500,
  'posters': 100,
  'vehicle-wraps': 1,
};

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({});

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const getMinQuantity = (item: { id: string; serviceSlug: string; name?: string }): number => {
    // Only check minimum quantities for printing services
    if (item.serviceSlug !== 'printing') {
      return 1;
    }
    
    // Extract tier name from item name (format: "Printing Services - Business Cards")
    if (item.name) {
      const tierName = item.name.split(' - ')[1] || item.name;
      
      // Direct match with tier name (e.g., "Business Cards")
      if (PRINTING_MIN_QUANTITIES[tierName]) {
        return PRINTING_MIN_QUANTITIES[tierName];
      }
      
      // Try matching with simplified key (convert "Business Cards" to "business-cards")
      const simplifiedKey = tierName.toLowerCase().replace(/\s+/g, '-');
      if (PRINTING_MIN_QUANTITIES[simplifiedKey]) {
        return PRINTING_MIN_QUANTITIES[simplifiedKey];
      }
      
      // Try matching with product slug format (e.g., "printing-business-cards")
      const productSlug = `printing-${simplifiedKey}`;
      if (PRINTING_MIN_QUANTITIES[productSlug]) {
        return PRINTING_MIN_QUANTITIES[productSlug];
      }
    }
    
    // Fallback: check by id (product ID as string) - unlikely to match but safe fallback
    return PRINTING_MIN_QUANTITIES[item.id] || 1;
  };

  const isPrintingService = (item: { id: string; serviceSlug: string; name?: string }): boolean => {
    // Check if it's a printing service
    if (item.serviceSlug === 'printing') {
      return getMinQuantity(item) > 1;
    }
    return false;
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const minQuantity = getMinQuantity(item);
    if (newQuantity < minQuantity) {
      toast.error(`Minimum quantity for this service is ${minQuantity} units. Please enter at least ${minQuantity}.`, {
        duration: 4000,
        icon: '⚠️',
      });
      // Reset input to current quantity
      setQuantityInputs(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
      return;
    }
    updateQuantity(itemId, newQuantity);
    // Clear the input value after successful update
    setQuantityInputs(prev => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const handleQuantityInputChange = (itemId: string, value: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const minQuantity = getMinQuantity(item);
    
    // Allow empty string for typing, and numbers only
    if (value === '' || /^\d+$/.test(value)) {
      // If a valid number is entered and it's below minimum, still allow typing
      // but we'll validate on blur
      const numValue = parseInt(value, 10);
      if (value !== '' && !isNaN(numValue) && numValue < minQuantity) {
        // Allow typing but mark as invalid (visual feedback already handled in className)
        setQuantityInputs(prev => ({
          ...prev,
          [itemId]: value
        }));
      } else {
        setQuantityInputs(prev => ({
          ...prev,
          [itemId]: value
        }));
      }
    }
  };

  const handleQuantityInputBlur = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const inputValue = quantityInputs[itemId];
    const minQuantity = getMinQuantity(item);
    const currentQuantity = item.quantity || minQuantity;
    
    if (inputValue !== undefined) {
      const numValue = parseInt(inputValue, 10);
      
      // If input is empty or invalid, reset to current quantity
      if (isNaN(numValue) || numValue <= 0) {
        setQuantityInputs(prev => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
        return;
      }
      
      // Check minimum quantity restriction - enforce minimum
      if (numValue < minQuantity) {
        toast.error(
          `Minimum quantity for "${item.name || 'this service'}" is ${minQuantity} units. Quantity has been set to ${minQuantity}.`,
          {
            duration: 5000,
            icon: '⚠️',
          }
        );
        // Auto-correct to minimum quantity
        updateQuantity(itemId, minQuantity);
        setQuantityInputs(prev => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
        return;
      }
      
      // Valid quantity, update it
      handleQuantityChange(itemId, numValue);
    }
  };

  const handleQuantityInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const formatPrice = (price: number, item: { id: string; serviceSlug: string }): string => {
    if (isPrintingService(item)) {
      const minQuantity = getMinQuantity(item);
      return `From A$${price.toLocaleString()} (min ${minQuantity})`;
    }
    return `A$${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <PageHeader 
        title="Shopping Cart"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Cart', href: '/cart' }
        ]}
      />
      
      <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Looks like you haven't added any services to your cart yet.
                </p>
                <button
                  onClick={() => navigate('/services')}
                  className="bg-[#1FBBD2] hover:bg-[#1A9DAA] text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft size={20} />
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Cart ({itemCount} items)</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate('/services')}
                      className="text-[#1FBBD2] hover:text-[#1A9DAA] font-semibold flex items-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Continue Shopping
                    </button>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-600 font-semibold"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const minQuantity = getMinQuantity(item);
                    const isPrinting = isPrintingService(item);
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {item.description}
                            </p>
                            
                            {/* Price display with bulk information */}
                            <div className="mb-4">
                              <div className="text-2xl font-bold text-[#1FBBD2]">
                                {formatPrice(item.price, item)}
                              </div>
                              {isPrinting && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-amber-600 dark:text-amber-400">
                                  <AlertCircle size={16} />
                                  <span>Bulk pricing - minimum {minQuantity} units</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mr-4">
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                <button
                                  onClick={() => {
                                    const newQuantity = item.quantity - 1;
                                    if (newQuantity >= minQuantity) {
                                      handleQuantityChange(item.id, newQuantity);
                                    }
                                  }}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= minQuantity}
                                  title={item.quantity <= minQuantity ? `Minimum quantity is ${minQuantity}` : 'Decrease quantity'}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min={minQuantity}
                                  step="1"
                                  value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.quantity}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Prevent entering values below minimum in real-time
                                    if (value === '' || /^\d+$/.test(value)) {
                                      const numValue = parseInt(value, 10);
                                      // If value is valid and below minimum, don't allow it
                                      if (value !== '' && !isNaN(numValue) && numValue < minQuantity && isPrinting) {
                                        // Show error but allow typing (will be corrected on blur)
                                        handleQuantityInputChange(item.id, value);
                                      } else {
                                        handleQuantityInputChange(item.id, value);
                                      }
                                    }
                                  }}
                                  onBlur={() => handleQuantityInputBlur(item.id)}
                                  onKeyPress={(e) => handleQuantityInputKeyPress(e, item.id)}
                                  className={`w-16 px-2 py-2 text-center font-semibold bg-transparent border-0 focus:outline-none focus:ring-2 rounded ${
                                    quantityInputs[item.id] !== undefined && 
                                    parseInt(quantityInputs[item.id], 10) < minQuantity && 
                                    !isNaN(parseInt(quantityInputs[item.id], 10))
                                      ? 'text-red-500 dark:text-red-400 focus:ring-red-500'
                                      : 'text-gray-900 dark:text-white focus:ring-[#1FBBD2]'
                                  }`}
                                  placeholder={minQuantity.toString()}
                                  aria-label={`Quantity for ${item.name}, minimum ${minQuantity}`}
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              {isPrinting && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Min: {minQuantity}
                                </span>
                              )}
                              {quantityInputs[item.id] !== undefined && 
                               parseInt(quantityInputs[item.id], 10) < minQuantity && 
                               !isNaN(parseInt(quantityInputs[item.id], 10)) && (
                                <span className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  Minimum: {minQuantity}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toLocaleString()}
                              </div>
                              {isPrinting && item.quantity < minQuantity * 2 && (
                                <div className="text-xs text-amber-600 dark:text-amber-400">
                                  Add more for better rates
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                            aria-label="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {total.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600 dark:text-gray-400">GST (10%):</span>
                      <span className="font-bold">{(total * 0.1).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</span>
                    </div>
                    <div className="flex justify-between mt-2 border-t pt-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                      <span className="text-2xl font-bold text-[#1FBBD2]">
                        {(total * 1.1).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleCheckout}
                    className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2"
                  >
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage; 