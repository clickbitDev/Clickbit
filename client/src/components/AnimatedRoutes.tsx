import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import PortfolioPage from '../pages/PortfolioPage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import PowerYourProjectPage from '../pages/PowerYourProjectPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import FAQPage from '../pages/FAQPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import Error404Page from '../pages/Error404Page';
import Error403Page from '../pages/Error403Page';
import Error503Page from '../pages/Error503Page';
import ErrorTestPage from '../pages/ErrorTestPage';
import ProtectedRoute from './ProtectedRoute';

// Admin Pages
import AdminRoute from './AdminRoute';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminBlogPage from '../pages/AdminBlogPage';
import AdminBlogPostForm from '../pages/AdminBlogPostForm';
import AdminPortfolioPage from '../pages/AdminPortfolioPage';
import AdminPortfolioItemForm from '../pages/AdminPortfolioItemForm';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminContactsPage from '../pages/AdminContactsPage';
import AdminServicesPage from '../pages/AdminServicesPage';
import AdminTeamPage from '../pages/AdminTeamPage';
import AdminMarketingIntegrationsPage from '../pages/AdminMarketingIntegrationsPage';
import AdminBillingSettingsPage from '../pages/AdminBillingSettingsPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/power-your-project" element={<ProtectedRoute><PowerYourProjectPage /></ProtectedRoute>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/test-errors" element={<ErrorTestPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="blog/new" element={<AdminBlogPostForm />} />
          <Route path="blog/edit/:id" element={<AdminBlogPostForm />} />
          <Route path="portfolio" element={<AdminPortfolioPage />} />
          <Route path="portfolio/new" element={<AdminPortfolioItemForm />} />
          <Route path="portfolio/edit/:id" element={<AdminPortfolioItemForm />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="marketing" element={<AdminMarketingIntegrationsPage />} />
          <Route path="billing" element={<AdminBillingSettingsPage />} />
        </Route>
        
        {/* Error Pages */}
        <Route path="/error/403" element={<Error403Page />} />
        <Route path="/error/503" element={<Error503Page />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes; 