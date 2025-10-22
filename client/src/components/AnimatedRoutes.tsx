import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// Keep HomePage loaded synchronously for fastest initial load
import HomePage from '../pages/HomePage';
// Error pages - keep small ones loaded for instant error handling
import Error404Page from '../pages/Error404Page';
import Error403Page from '../pages/Error403Page';
import Error503Page from '../pages/Error503Page';
import ProtectedRoute from './ProtectedRoute';

// Loading component for better UX
const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load all other pages for optimal code splitting
const AboutPage = React.lazy(() => import('../pages/AboutPage'));
const ServicesPage = React.lazy(() => import('../pages/ServicesPage'));
const ContactPage = React.lazy(() => import('../pages/ContactPage'));
const ServiceDetailPage = React.lazy(() => import('../pages/ServiceDetailPage'));
const PortfolioPage = React.lazy(() => import('../pages/PortfolioPage'));
const BlogPage = React.lazy(() => import('../pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('../pages/BlogPostPage'));
const PortfolioItemPage = React.lazy(() => import('../pages/PortfolioItemPage'));
const PowerYourProjectPage = React.lazy(() => import('../pages/PowerYourProjectPage'));
const PrivacyPolicyPage = React.lazy(() => import('../pages/PrivacyPolicyPage'));
const FAQPage = React.lazy(() => import('../pages/FAQPage'));
const TermsOfServicePage = React.lazy(() => import('../pages/TermsOfServicePage'));
const CartPage = React.lazy(() => import('../pages/CartPage'));
const CheckoutPage = React.lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('../pages/OrderConfirmationPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../pages/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('../pages/VerifyEmailPage'));
const ErrorTestPage = React.lazy(() => import('../pages/ErrorTestPage'));

const CheckoutCancelledPage = React.lazy(() => import('../pages/CheckoutCancelledPage'));
const CheckoutSuccessPage = React.lazy(() => import('../pages/CheckoutSuccessPage'));
const TestSuccessPage = React.lazy(() => import('../pages/TestSuccessPage'));

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home page - keep synchronous for fastest initial load */}
        <Route path="/" element={<HomePage />} />
        
        {/* All other routes wrapped in Suspense for lazy loading */}
        <Route path="/login" element={<Suspense fallback={<PageLoadingSpinner />}><LoginPage /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<PageLoadingSpinner />}><RegisterPage /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<PageLoadingSpinner />}><ForgotPasswordPage /></Suspense>} />
        <Route path="/reset-password" element={<Suspense fallback={<PageLoadingSpinner />}><ResetPasswordPage /></Suspense>} />
        <Route path="/verify-email" element={<Suspense fallback={<PageLoadingSpinner />}><VerifyEmailPage /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<PageLoadingSpinner />}><AboutPage /></Suspense>} />
        <Route path="/services" element={<Suspense fallback={<PageLoadingSpinner />}><ServicesPage /></Suspense>} />
        <Route path="/services/:slug" element={<Suspense fallback={<PageLoadingSpinner />}><ServiceDetailPage /></Suspense>} />
        <Route path="/web-development" element={<Suspense fallback={<PageLoadingSpinner />}><ServicesPage /></Suspense>} />
        <Route path="/digital-marketing" element={<Suspense fallback={<PageLoadingSpinner />}><ServicesPage /></Suspense>} />
        <Route path="/it-support" element={<Suspense fallback={<PageLoadingSpinner />}><ServicesPage /></Suspense>} />
        <Route path="/cloud-solutions" element={<Suspense fallback={<PageLoadingSpinner />}><ServicesPage /></Suspense>} />
        <Route path="/portfolio" element={<Suspense fallback={<PageLoadingSpinner />}><PortfolioPage /></Suspense>} />
        <Route path="/portfolio/:slug" element={<Suspense fallback={<PageLoadingSpinner />}><PortfolioItemPage /></Suspense>} />
        <Route path="/blog" element={<Suspense fallback={<PageLoadingSpinner />}><BlogPage /></Suspense>} />
        <Route path="/blog/:slug" element={<Suspense fallback={<PageLoadingSpinner />}><BlogPostPage /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageLoadingSpinner />}><ContactPage /></Suspense>} />
        <Route path="/contact-us" element={<Suspense fallback={<PageLoadingSpinner />}><ContactPage /></Suspense>} />
        <Route path="/get-started" element={<Suspense fallback={<PageLoadingSpinner />}><ProtectedRoute><PowerYourProjectPage /></ProtectedRoute></Suspense>} />
        <Route path="/start-project" element={<Suspense fallback={<PageLoadingSpinner />}><ProtectedRoute><PowerYourProjectPage /></ProtectedRoute></Suspense>} />
        <Route path="/cart" element={<Suspense fallback={<PageLoadingSpinner />}><CartPage /></Suspense>} />
        <Route path="/checkout" element={<Suspense fallback={<PageLoadingSpinner />}><CheckoutPage /></Suspense>} />
        <Route path="/order-confirmation" element={<Suspense fallback={<PageLoadingSpinner />}><OrderConfirmationPage /></Suspense>} />
        <Route path="/checkout/success" element={<Suspense fallback={<PageLoadingSpinner />}><CheckoutSuccessPage /></Suspense>} />
        <Route path="/success" element={<Suspense fallback={<PageLoadingSpinner />}><TestSuccessPage /></Suspense>} />
        <Route path="/checkout-success" element={<Suspense fallback={<PageLoadingSpinner />}><TestSuccessPage /></Suspense>} />
        <Route path="/checkout-cancelled" element={<Suspense fallback={<PageLoadingSpinner />}><CheckoutCancelledPage /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<PageLoadingSpinner />}><PrivacyPolicyPage /></Suspense>} />
        <Route path="/faq" element={<Suspense fallback={<PageLoadingSpinner />}><FAQPage /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<PageLoadingSpinner />}><TermsOfServicePage /></Suspense>} />
        <Route path="/test-errors" element={<Suspense fallback={<PageLoadingSpinner />}><ErrorTestPage /></Suspense>} />
        
        
        {/* Error Pages - Keep synchronous for instant error handling */}
        <Route path="/error/403" element={<Error403Page />} />
        <Route path="/error/503" element={<Error503Page />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes; 