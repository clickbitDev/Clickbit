// AdminApp.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
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
import AdminRoute from './components/AdminRoute';
import AdminOnlyRoute from './components/AdminOnlyRoute';
import AdminLayout from './components/Layout/AdminLayout';
import AdminUserForm from './pages/AdminUserForm';
import AdminReviewsPage from './pages/AdminReviewsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const AdminApp: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/*" element={<AdminRoute />}>
                <Route path="*" element={
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="/dashboard" element={<AdminDashboardPage />} />
                      <Route path="/orders" element={<AdminOrdersPage />} />
                      <Route path="/blog" element={<AdminBlogPage />} />
                      <Route path="/blog/new" element={<AdminBlogPostForm />} />
                      <Route path="/blog/edit/:id" element={<AdminBlogPostForm />} />
                      <Route path="/portfolio" element={<AdminPortfolioPage />} />
                      <Route path="/portfolio/new" element={<AdminPortfolioItemForm />} />
                      <Route path="/portfolio/edit/:id" element={<AdminPortfolioItemForm />} />
                      <Route path="/services" element={<AdminServicesPage />} />
                      <Route path="/reviews" element={<AdminReviewsPage />} />
                      <Route path="/team" element={<AdminTeamPage />} />
                      <Route path="/contacts" element={<AdminContactsPage />} />
                      <Route path="/users" element={<AdminUsersPage />} />
                      <Route path="/users/new" element={<AdminUserForm />} />
                      <Route path="/users/edit/:id" element={<AdminUserForm />} />
                    </Routes>
                  </AdminLayout>
                } />
              </Route>
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default AdminApp; 