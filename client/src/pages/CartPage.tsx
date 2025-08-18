import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, CreditCard, Plus, Minus, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Define minimum quantities for printing services
const PRINTING_MIN_QUANTITIES: { [key: string]: number } = {
  'business-cards': 500,
  'flyers': 500,
  'brochures': 500,
  'banners': 1, // per sqm
  'pull-up-banners': 1,
  'letterheads': 500,
  'posters': 100,
  'vehicle-wraps': 1, // per sqm
};

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const getMinQuantity = (itemId: string): number => {
    return PRINTING_MIN_QUANTITIES[itemId] || 1;
  };

  const isPrintingService = (itemId: string): boolean => {
    return Object.keys(PRINTING_MIN_QUANTITIES).includes(itemId);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const minQuantity = getMinQuantity(itemId);
    if (newQuantity < minQuantity) {
      alert(`Minimum quantity for this service is ${minQuantity}`);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const formatPrice = (price: number, itemId: string): string => {
    if (isPrintingService(itemId)) {
      const minQuantity = getMinQuantity(itemId);
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
                    const minQuantity = getMinQuantity(item.id);
                    const isPrinting = isPrintingService(item.id);
                    
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
                                {formatPrice(item.price, item.id)}
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
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= minQuantity}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
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