import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminOnlyRoute: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1FBBD2]"></div>
      </div>
    );
  }

  // Check if the user is authenticated and has admin role only
  const isAuthorized = isAuthenticated && user && user.role === 'admin';

  // If not authorized, redirect to admin dashboard
  if (!isAuthorized) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If authorized, render the admin-only routes
  return <Outlet />;
};

export default AdminOnlyRoute; 