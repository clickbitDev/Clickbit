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
// Admin Pages - All lazy loaded since they're admin-only
import AdminRoute from './AdminRoute';

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

// Admin pages - all lazy loaded
const AdminDashboardPage = React.lazy(() => import('../pages/AdminDashboardPage'));
const AdminBlogPage = React.lazy(() => import('../pages/AdminBlogPage'));
const AdminBlogPostForm = React.lazy(() => import('../pages/AdminBlogPostForm'));
const AdminPortfolioPage = React.lazy(() => import('../pages/AdminPortfolioPage'));
const AdminPortfolioItemForm = React.lazy(() => import('../pages/AdminPortfolioItemForm'));
const AdminUsersPage = React.lazy(() => import('../pages/AdminUsersPage'));
const AdminContactsPage = React.lazy(() => import('../pages/AdminContactsPage'));
const AdminServicesPage = React.lazy(() => import('../pages/AdminServicesPage'));
const AdminTeamPage = React.lazy(() => import('../pages/AdminTeamPage'));
const AdminMarketingIntegrationsPage = React.lazy(() => import('../pages/AdminMarketingIntegrationsPage'));
const AdminBillingSettingsPage = React.lazy(() => import('../pages/AdminBillingSettingsPage'));

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
        <Route path="/blog" element={<Suspense fallback={<PageLoadingSpinner />}><BlogPage /></Suspense>} />
        <Route path="/blog/:slug" element={<Suspense fallback={<PageLoadingSpinner />}><BlogPostPage /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageLoadingSpinner />}><ContactPage /></Suspense>} />
        <Route path="/contact-us" element={<Suspense fallback={<PageLoadingSpinner />}><ContactPage /></Suspense>} />
        <Route path="/get-started" element={<Suspense fallback={<PageLoadingSpinner />}><ProtectedRoute><PowerYourProjectPage /></ProtectedRoute></Suspense>} />
        <Route path="/start-project" element={<Suspense fallback={<PageLoadingSpinner />}><ProtectedRoute><PowerYourProjectPage /></ProtectedRoute></Suspense>} />
        <Route path="/cart" element={<Suspense fallback={<PageLoadingSpinner />}><CartPage /></Suspense>} />
        <Route path="/checkout" element={<Suspense fallback={<PageLoadingSpinner />}><CheckoutPage /></Suspense>} />
        <Route path="/order-confirmation" element={<Suspense fallback={<PageLoadingSpinner />}><OrderConfirmationPage /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<PageLoadingSpinner />}><PrivacyPolicyPage /></Suspense>} />
        <Route path="/faq" element={<Suspense fallback={<PageLoadingSpinner />}><FAQPage /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<PageLoadingSpinner />}><TermsOfServicePage /></Suspense>} />
        <Route path="/test-errors" element={<Suspense fallback={<PageLoadingSpinner />}><ErrorTestPage /></Suspense>} />
        
        {/* Admin Routes - All lazy loaded */}
        <Route path="/admin/*" element={<AdminRoute />}>
          <Route path="dashboard" element={<Suspense fallback={<PageLoadingSpinner />}><AdminDashboardPage /></Suspense>} />
          <Route path="blog" element={<Suspense fallback={<PageLoadingSpinner />}><AdminBlogPage /></Suspense>} />
          <Route path="blog/new" element={<Suspense fallback={<PageLoadingSpinner />}><AdminBlogPostForm /></Suspense>} />
          <Route path="blog/edit/:id" element={<Suspense fallback={<PageLoadingSpinner />}><AdminBlogPostForm /></Suspense>} />
          <Route path="portfolio" element={<Suspense fallback={<PageLoadingSpinner />}><AdminPortfolioPage /></Suspense>} />
          <Route path="portfolio/new" element={<Suspense fallback={<PageLoadingSpinner />}><AdminPortfolioItemForm /></Suspense>} />
          <Route path="portfolio/edit/:id" element={<Suspense fallback={<PageLoadingSpinner />}><AdminPortfolioItemForm /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageLoadingSpinner />}><AdminUsersPage /></Suspense>} />
          <Route path="contacts" element={<Suspense fallback={<PageLoadingSpinner />}><AdminContactsPage /></Suspense>} />
          <Route path="services" element={<Suspense fallback={<PageLoadingSpinner />}><AdminServicesPage /></Suspense>} />
          <Route path="team" element={<Suspense fallback={<PageLoadingSpinner />}><AdminTeamPage /></Suspense>} />
          <Route path="marketing" element={<Suspense fallback={<PageLoadingSpinner />}><AdminMarketingIntegrationsPage /></Suspense>} />
          <Route path="billing" element={<Suspense fallback={<PageLoadingSpinner />}><AdminBillingSettingsPage /></Suspense>} />
        </Route>
        
        {/* Error Pages - Keep synchronous for instant error handling */}
        <Route path="/error/403" element={<Error403Page />} />
        <Route path="/error/503" element={<Error503Page />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes; 