import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { paymentsAPI } from '../services/api';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(location.state?.orderData);
  const [loading, setLoading] = useState(false);

  // Handle Stripe Checkout session
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && !orderData) {
      // User came from Stripe Checkout, fetch order data
      setLoading(true);
      paymentsAPI.getOrder(sessionId)
        .then(response => {
          setOrderData(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch order:', error);
          // Don't redirect immediately - show error message instead
          setOrderData({
            error: 'Unable to load order details. Please contact support if this issue persists.',
            sessionId: sessionId
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams, orderData, navigate]);

  // Track order confirmation view (in case user bookmarks or shares this page)
  useEffect(() => {
    if (typeof window.trackEvent === 'function' && orderData?.order) {
      window.trackEvent('view_order_confirmation', {
        event_category: 'ecommerce',
        order_id: orderData.order.id,
        order_value: orderData.order.total,
        currency: 'AUD'
      });
    }
  }, [orderData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only redirect to cart if we're not loading and have no order data
  // and no session_id (meaning user didn't come from Stripe checkout)
  const sessionId = searchParams.get('session_id');
  if (!orderData && !sessionId) {
    navigate('/cart');
    return null;
  }

  // If we have a session_id but no order data yet, show loading
  if (sessionId && !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error case
  if (orderData?.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your payment has been processed successfully. However, we're having trouble loading your order details.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">What happened?</h3>
              <p className="text-sm text-yellow-700">
                {orderData.error}
              </p>
              {orderData.sessionId && (
                <p className="text-xs text-yellow-600 mt-2">
                  Session ID: {orderData.sessionId}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
              
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { order, payment } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your payment and will begin processing your order shortly.
          </p>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">{payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-sm">{payment.transactionId}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${order.total.toFixed(2)} {order.currency}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">What's Next?</h3>
            <p className="text-sm text-blue-700">
              You'll receive an email confirmation shortly with your order details. 
              Our team will contact you within 1-2 business days to discuss your project requirements and timeline.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;