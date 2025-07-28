import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Debug authentication state
  console.log('AdminRoute - Auth state:', {
    isLoading,
    isAuthenticated,
    userRole: user?.role,
    user: user ? 'exists' : 'null',
    isAuthorized: isAuthenticated && user && (user.role === 'admin' || user.role === 'manager')
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('AdminRoute - Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1FBBD2]"></div>
      </div>
    );
  }

  // Check if the user is authenticated and has an admin or manager role
  const isAuthorized = isAuthenticated && user && (user.role === 'admin' || user.role === 'manager');

  // If not authorized, redirect to login
  if (!isAuthorized) {
    console.log('AdminRoute - Not authorized, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authorized, render the admin routes
  console.log('AdminRoute - Authorized, rendering admin routes');
  return <Outlet />;
};

export default AdminRoute; 