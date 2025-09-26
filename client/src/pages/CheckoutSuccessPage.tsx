import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Redirect to the correct order confirmation page with session_id
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      navigate(`/order-confirmation?session_id=${sessionId}`, { replace: true });
    } else {
      // If no session_id, redirect to order confirmation without it
      navigate('/order-confirmation', { replace: true });
    }
  }, [navigate, searchParams]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to order confirmation...</p>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
