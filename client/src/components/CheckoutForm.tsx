import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { paymentsAPI } from '../services/api';

interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  amount: number;
  currency: string;
  items: CartItem[];
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  paymentMethod?: 'stripe' | 'paypal';
}

const StripeCheckoutForm: React.FC<Omit<CheckoutFormProps, 'paymentMethod'>> = ({
  amount,
  currency,
  items,
  onSuccess,
  onError
}) => {
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postcode: '',
    state: '',
    country: 'Australia'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerInfo.email || !customerInfo.name) {
      onError('Please fill in all required fields.');
      return;
    }

    setProcessing(true);

    try {
      // Create Stripe Checkout session and redirect
      const { data } = await paymentsAPI.createCheckoutSession({
        amount,
        currency: currency.toLowerCase(),
        items,
        customerInfo
      });

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      onError(error.response?.data?.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      
      const orderData = await paymentsAPI.confirmPayment({
        paypalOrderId: details.id,
        items,
        customerInfo,
        paymentMethod: 'paypal',
        paypalDetails: details
      });
      
      onSuccess(orderData.data);
    } catch (error: any) {
      onError(error.response?.data?.message || 'PayPal payment failed');
    }
  };

  const createPayPalOrder = async () => {
    try {
      const { data } = await paymentsAPI.createPayPalOrder({
        amount,
        currency,
        items,
        customerInfo
      });
      return data.orderID;
    } catch (error: any) {
      onError(error.response?.data?.message || 'Failed to create PayPal order');
      throw error;
    }
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={customerInfo.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <select
            id="state"
            name="state"
            value={customerInfo.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="WA">WA</option>
            <option value="SA">SA</option>
            <option value="TAS">TAS</option>
            <option value="ACT">ACT</option>
            <option value="NT">NT</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Postcode
          </label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={customerInfo.postcode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <form onSubmit={handleStripeSubmit}>
        <div className="mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You will be redirected to Stripe's secure checkout page to complete your payment.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={processing}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {processing ? 'Redirecting...' : `Pay $${amount.toFixed(2)} ${currency}`}
        </button>
      </form>
    </div>
  );
};

const PayPalCheckoutForm: React.FC<Omit<CheckoutFormProps, 'paymentMethod'>> = ({
  amount,
  currency,
  items,
  onSuccess,
  onError
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postcode: '',
    state: '',
    country: 'Australia'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      
      
      // For mock testing, skip the capture step
      if (data.orderID && data.orderID.startsWith('MOCK_ORDER_')) {

        
        const orderData = await paymentsAPI.confirmPayment({
          paypalOrderId: data.orderID,
          items,
          customerInfo,
          paymentMethod: 'paypal',
          paypalDetails: { id: data.orderID, status: 'COMPLETED' }
        });
        
        
        onSuccess(orderData.data);
        return;
      }
      
      // Real PayPal flow
      const details = await actions.order.capture();
      
      
      const orderData = await paymentsAPI.confirmPayment({
        paypalOrderId: details.id,
        items,
        customerInfo,
        paymentMethod: 'paypal',
        paypalDetails: details
      });
      
      
      onSuccess(orderData.data);
    } catch (error: any) {
      console.error('PayPal payment approval failed:', error);
      onError(error.response?.data?.message || 'PayPal payment failed');
    }
  };

  const createPayPalOrder = async () => {
    try {
      
      
      if (!customerInfo.email || !customerInfo.name) {
        throw new Error('Please fill in your email and name before proceeding with PayPal payment');
      }
      
      const { data } = await paymentsAPI.createPayPalOrder({
        amount,
        currency,
        items,
        customerInfo
      });
      
      
      return data.orderID;
    } catch (error: any) {
      console.error('PayPal order creation failed:', error);
      onError(error.response?.data?.message || error.message || 'Failed to create PayPal order');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="paypal-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="paypal-email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="paypal-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="paypal-name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="paypal-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          id="paypal-address"
          name="address"
          value={customerInfo.address}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="paypal-city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="paypal-city"
            name="city"
            value={customerInfo.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="paypal-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <select
            id="paypal-state"
            name="state"
            value={customerInfo.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="WA">WA</option>
            <option value="SA">SA</option>
            <option value="TAS">TAS</option>
            <option value="ACT">ACT</option>
            <option value="NT">NT</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="paypal-postcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Postcode
          </label>
          <input
            type="text"
            id="paypal-postcode"
            name="postcode"
            value={customerInfo.postcode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <PayPalButtons
        createOrder={createPayPalOrder}
        onApprove={handlePayPalApprove}
        onError={(err) => {
          console.error('PayPal button error:', err);
          onError('PayPal payment failed: ' + (err?.message || 'Unknown error'));
        }}
        onCancel={(data) => {
  
        }}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }}
      />
    </div>
  );
};

const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  if (props.paymentMethod === 'paypal') {
    return <PayPalCheckoutForm {...props} />;
  } else {
    return <StripeCheckoutForm {...props} />;
  }
};

export default CheckoutForm;