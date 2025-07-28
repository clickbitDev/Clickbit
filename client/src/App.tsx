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
import SiteHead from './components/SiteHead';
import { ErrorHandler } from './utils/errorHandler';

// Import Admin components
import AdminRoute from './components/AdminRoute';
import AdminOnlyRoute from './components/AdminOnlyRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminBlogPage from './pages/AdminBlogPage';
import AdminBlogPostForm from './pages/AdminBlogPostForm';
import AdminPortfolioPage from './pages/AdminPortfolioPage';
import AdminPortfolioItemForm from './pages/AdminPortfolioItemForm';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminContactsPage from './pages/AdminContactsPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminTeamPage from './pages/AdminTeamPage';
import AdminUserForm from './pages/AdminUserForm';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminContentManagementPage from './pages/AdminContentManagementPage';
import AdminServicesDetailPage from './pages/AdminServicesDetailPage';
import AdminMarketingIntegrationsPage from './pages/AdminMarketingIntegrationsPage';
import AdminBillingSettingsPage from './pages/AdminBillingSettingsPage';

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
        <Routes>
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="blog/new" element={<AdminBlogPostForm />} />
            <Route path="blog/edit/:id" element={<AdminBlogPostForm />} />
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
          </Route>
        </Routes>
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
                    <SiteHead />
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