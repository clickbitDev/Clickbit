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
import PageViewTracker from './components/PageViewTracker';

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

// Component to initialize error handler
const ErrorHandlerInitializer: React.FC = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    ErrorHandler.setNavigate(navigate);
  }, [navigate]);
  
  return null;
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
                    <ErrorHandlerInitializer />
                    <PageViewTracker />
                    <Routes>
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminRoute />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminDashboardPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="orders" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminOrdersPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="blog" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminBlogPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="blog/new" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminBlogPostForm />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="blog/edit/:id" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminBlogPostForm />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="blog/scheduled" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminScheduledPostsPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="portfolio" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminPortfolioPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="portfolio/new" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminPortfolioItemForm />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="portfolio/edit/:id" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminPortfolioItemForm />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route element={<AdminOnlyRoute />}>
                          <Route path="users" element={
                            <AdminLayout>
                              <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                                <AdminUsersPage />
                              </React.Suspense>
                            </AdminLayout>
                          } />
                          <Route path="users/new" element={
                            <AdminLayout>
                              <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                                <AdminUserForm />
                              </React.Suspense>
                            </AdminLayout>
                          } />
                          <Route path="users/edit/:id" element={
                            <AdminLayout>
                              <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                                <AdminUserForm />
                              </React.Suspense>
                            </AdminLayout>
                          } />
                        </Route>
                        <Route path="contacts" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminContactsPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="services" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminServicesPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="team" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminTeamPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="reviews" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminReviewsPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="content" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminContentManagementPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="services/:slug/detail" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminServicesDetailPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="marketing" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminMarketingIntegrationsPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="billing" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminBillingSettingsPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                        <Route path="analytics" element={
                          <AdminLayout>
                            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                              <AdminAnalyticsPage />
                            </React.Suspense>
                          </AdminLayout>
                        } />
                      </Route>
                      
                      {/* Public Routes */}
                      <Route path="/*" element={
                        <Layout>
                          <AnimatedRoutes />
                        </Layout>
                      } />
                    </Routes>
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