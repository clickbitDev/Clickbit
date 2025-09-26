import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ContentProvider } from './contexts/ContentContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import AnimatedRoutes from './components/AnimatedRoutes';

import { ErrorHandler } from './utils/errorHandler';
import './services/analytics'; // Initialize analytics service

// Lazy load Admin components for better performance
import AdminRoute from './components/AdminRoute';
import AdminOnlyRoute from './components/AdminOnlyRoute';
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/AdminOrdersPage'));
const AdminBlogPage = React.lazy(() => import('./pages/AdminBlogPage'));
const AdminBlogPostForm = React.lazy(() => import('./pages/AdminBlogPostForm'));
const AdminScheduledPostsPage = React.lazy(() => import('./pages/AdminScheduledPostsPage'));
const AdminPortfolioPage = React.lazy(() => import('./pages/AdminPortfolioPage'));
const AdminPortfolioItemForm = React.lazy(() => import('./pages/AdminPortfolioItemForm'));
const AdminUsersPage = React.lazy(() => import('./pages/AdminUsersPage'));
const AdminContactsPage = React.lazy(() => import('./pages/AdminContactsPage'));
const AdminServicesPage = React.lazy(() => import('./pages/AdminServicesPage'));
const AdminTeamPage = React.lazy(() => import('./pages/AdminTeamPage'));
const AdminUserForm = React.lazy(() => import('./pages/AdminUserForm'));
const AdminReviewsPage = React.lazy(() => import('./pages/AdminReviewsPage'));
const AdminContentManagementPage = React.lazy(() => import('./pages/AdminContentManagementPage'));
const AdminServicesDetailPage = React.lazy(() => import('./pages/AdminServicesDetailPage'));
const AdminMarketingIntegrationsPage = React.lazy(() => import('./pages/AdminMarketingIntegrationsPage'));
const AdminBillingSettingsPage = React.lazy(() => import('./pages/AdminBillingSettingsPage'));
const AdminAnalyticsPage = React.lazy(() => import('./pages/AdminAnalyticsPage'));

// Component to handle layout switching
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Initialize error handler with navigation
  React.useEffect(() => {
    ErrorHandler.setNavigate(navigate);
  }, [navigate]);

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
          <Routes>
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="blog/new" element={<AdminBlogPostForm />} />
              <Route path="blog/edit/:id" element={<AdminBlogPostForm />} />
              <Route path="blog/scheduled" element={<AdminScheduledPostsPage />} />
              <Route path="portfolio" element={<AdminPortfolioPage />} />
              <Route path="portfolio/new" element={<AdminPortfolioItemForm />} />
              <Route path="portfolio/edit/:id" element={<AdminPortfolioItemForm />} />
              <Route element={<AdminOnlyRoute />}>
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/new" element={<AdminUserForm />} />
                <Route path="users/edit/:id" element={<AdminUserForm />} />
              </Route>
              <Route path="contacts" element={<AdminContactsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="team" element={<AdminTeamPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="content" element={<AdminContentManagementPage />} />
              <Route path="services/:slug/detail" element={<AdminServicesDetailPage />} />
                            <Route path="marketing" element={<AdminMarketingIntegrationsPage />} />
              <Route path="billing" element={<AdminBillingSettingsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
            </Route>
          </Routes>
        </React.Suspense>
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <SocketProvider>
              <CartProvider>
                <ContentProvider>
                  <HelmetProvider>
                    <AppContent />
                  </HelmetProvider>
                </ContentProvider>
              </CartProvider>
            </SocketProvider>
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App; 