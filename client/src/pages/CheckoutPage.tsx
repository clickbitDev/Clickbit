import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCart } from '../contexts/CartContext';
import api, { settingsAPI } from '../services/api';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import CheckoutForm from '../components/CheckoutForm';
import toast from 'react-hot-toast';

interface BillingSettings {
  stripePublishableKey: string;
  paypalClientId: string;
  currencyCode: string;
  taxRate: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [billingSettings, setBillingSettings] = useState<BillingSettings | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const calculateTotals = () => {
    const subtotal = total;
    const gstRate = billingSettings?.taxRate ? billingSettings.taxRate / 100 : 0.1;
    const gst = subtotal * gstRate;
    const finalTotal = subtotal + gst;
    
    return {
      subtotal,
      gst,
      total: finalTotal
    };
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    
    // Track Meta Pixel InitiateCheckout event when user arrives at checkout
    if (typeof window.fbq === 'function') {
      const totals = calculateTotals();
      window.fbq('track', 'InitiateCheckout', {
        value: totals.total,
        currency: billingSettings?.currencyCode || 'AUD',
        num_items: items.length
      });
    }
    
    fetchBillingSettings();
  }, [items, navigate]);

  const fetchBillingSettings = async () => {
    try {
      const response = await api.get('/settings/public/billing-settings');
      const settings = response.data;
      console.log('Billing settings loaded:', settings);
      console.log('Stripe key available:', !!settings.stripePublishableKey);
      console.log('PayPal client ID available:', !!settings.paypalClientId);
      setBillingSettings(settings);
      
      if (settings.stripePublishableKey) {
        const stripe = await loadStripe(settings.stripePublishableKey);
        setStripePromise(stripe);
      }
    } catch (error) {
      console.error('Failed to fetch billing settings:', error);
      toast.error('Failed to load payment options');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Track purchase conversion
    if (typeof window.trackPurchase === 'function') {
      const totals = calculateTotals();
      window.trackPurchase(
        paymentData.order?.id || `order_${Date.now()}`,
        totals.total,
        billingSettings?.currencyCode || 'AUD',
        items.map(item => ({
          id: item.id,
          name: item.name,
          category: 'Service',
          quantity: item.quantity,
          price: item.price
        }))
      );
    }
    
    // Track checkout completion
    if (typeof window.trackEvent === 'function') {
      const totals = calculateTotals();
      window.trackEvent('purchase', {
        event_category: 'ecommerce',
        transaction_id: paymentData.order?.id || `order_${Date.now()}`,
        value: totals.total,
        currency: billingSettings?.currencyCode || 'AUD',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: 'Service',
          quantity: item.quantity,
          price: item.price
        }))
      });
    }
    
    // Track Meta Pixel Purchase event
    if (typeof window.fbq === 'function') {
      const totals = calculateTotals();
      window.fbq('track', 'Purchase', {
        value: totals.total,
        currency: billingSettings?.currencyCode || 'AUD'
      });
    }
    
    toast.success('Payment successful!');
    clearCart();
    navigate('/order-confirmation', { state: { orderData: paymentData } });
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </motion.div>
    );
  }

  if (!billingSettings) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <PageHeader 
          title="Checkout"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Cart', href: '/cart' },
            { name: 'Checkout', href: '/checkout' }
          ]}
        />
        <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Unavailable</h2>
              <p className="text-gray-600 dark:text-gray-400">Payment processing is not configured. Please try again later.</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const { subtotal, gst, total: finalTotal } = calculateTotals();

  const paypalInitialOptions = {
    clientId: billingSettings.paypalClientId,
    currency: billingSettings.currencyCode,
    intent: 'capture' as const,
    environment: 'sandbox' as const // Set to 'production' for live payments
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
        title="Checkout"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Cart', href: '/cart' },
          { name: 'Checkout', href: '/checkout' }
        ]}
      />
      
      <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <hr />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">GST ({billingSettings.taxRate}%):</span>
                    <span className="text-gray-900 dark:text-white">${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">${finalTotal.toFixed(2)} {billingSettings.currencyCode}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment Method</h2>
              
              <div className="mb-6">
                <div className="flex space-x-4">
                  {billingSettings.stripePublishableKey && (
                    <button
                      onClick={() => setSelectedPaymentMethod('stripe')}
                      className={`flex-1 p-4 border rounded-lg transition-colors duration-200 ${
                        selectedPaymentMethod === 'stripe'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white">Credit Card</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Powered by Stripe</div>
                      </div>
                    </button>
                  )}
                  
                  {billingSettings.paypalClientId && (
                    <button
                      onClick={() => setSelectedPaymentMethod('paypal')}
                      className={`flex-1 p-4 border rounded-lg transition-colors duration-200 ${
                        selectedPaymentMethod === 'paypal'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white">PayPal</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pay with PayPal</div>
                      </div>
                    </button>
                  )}
                </div>
                
                {!billingSettings.stripePublishableKey && !billingSettings.paypalClientId && (
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      No payment methods are configured. Please contact the administrator.
                    </p>
                  </div>
                )}
              </div>

              {selectedPaymentMethod === 'stripe' && billingSettings.stripePublishableKey && stripePromise && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={finalTotal}
                    currency={billingSettings.currencyCode}
                    items={items}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    paymentMethod="stripe"
                  />
                </Elements>
              )}

              {selectedPaymentMethod === 'paypal' && billingSettings.paypalClientId && (
                <PayPalScriptProvider options={paypalInitialOptions}>
                  <CheckoutForm
                    amount={finalTotal}
                    currency={billingSettings.currencyCode}
                    items={items}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    paymentMethod="paypal"
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;