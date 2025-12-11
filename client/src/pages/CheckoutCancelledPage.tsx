import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutCancelledPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout Cancelled</h1>
          <p className="text-gray-600 mb-8">
            Your checkout process was cancelled. No payment has been processed and no charges have been made.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">What happened?</h3>
            <p className="text-sm text-yellow-700">
              You may have closed the payment window, cancelled the payment, or encountered an error during checkout. 
              Your items are still in your cart and ready for checkout when you're ready.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Back to Cart
            </button>
            
            <button
              onClick={() => navigate('/checkout')}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Checkout Again
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutCancelledPage;
