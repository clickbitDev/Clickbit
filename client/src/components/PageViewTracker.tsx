import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../services/analytics';

const PageViewTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    analytics.trackPageView();
  }, [location]);

  return null; // This component doesn't render anything
};

export default PageViewTracker;
