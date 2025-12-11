import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const TestSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your payment. Your transaction has been processed successfully.
          </p>
          
          {sessionId && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Transaction Details</h3>
              <p className="text-sm text-blue-700">
                Session ID: {sessionId}
              </p>
            </div>
          )}
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-green-900 mb-2">What's Next?</h3>
            <p className="text-sm text-green-700">
              You'll receive an email confirmation shortly with your order details. 
              Our team will contact you within 1-2 business days to discuss your project requirements and timeline.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSuccessPage;
