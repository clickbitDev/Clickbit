import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import api, { paymentsAPI } from '../services/api';

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
  const stripe = useStripe();
  const elements = useElements();
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

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found.');
      return;
    }

    if (!customerInfo.email || !customerInfo.name) {
      onError('Please fill in all required fields.');
      return;
    }

    setProcessing(true);

    try {
      const { data } = await paymentsAPI.createPaymentIntent({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        items,
        customerInfo
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.postcode,
              state: customerInfo.state,
              country: customerInfo.country
            }
          }
        }
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        const orderData = await paymentsAPI.confirmPayment({
          paymentIntentId: paymentIntent.id,
          items,
          customerInfo,
          paymentMethod: 'stripe'
        });
        onSuccess(orderData.data);
      }
    } catch (error: any) {
      onError(error.response?.data?.message || 'Payment processing failed');
    } finally {
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

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        ':-webkit-autofill': {
          color: '#fefefe',
        },
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Details
          </label>
          <div className="p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {processing ? 'Processing...' : `Pay $${amount.toFixed(2)} ${currency}`}
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