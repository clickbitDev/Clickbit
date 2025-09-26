import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Image, MessageSquare, Settings, LogOut, Layers, Home, Briefcase, BookOpen, Grid, UserCircle, Menu, X, Star, Mail, Edit, TrendingUp, CreditCard, ShoppingBag, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home, permission: 'dashboard:view' },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, permission: 'orders:list' },
  { to: '/admin/blog', label: 'Blog', icon: BookOpen, permission: 'content:list' },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Briefcase, permission: 'content:list' },
  { to: '/admin/services', label: 'Services', icon: Layers, permission: 'services:list' },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, permission: 'reviews:list' },
  { to: '/admin/team', label: 'Team', icon: UserCircle, permission: 'team:list' },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail, permission: 'contacts:list' },
  { to: '/admin/users', label: 'Users', icon: Users, permission: 'users:list' },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, permission: 'dashboard:view' },
  { to: '/admin/marketing', label: 'Marketing', icon: TrendingUp, permission: 'marketing:view' },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard, permission: 'billing:view' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get theme-appropriate logo (matching public site)
  const getLogo = () => {
    return theme === 'dark' ? '/images/logos/clickbit-logo-single-color-light.png' : '/images/logos/Click Bit Logo Vec Full.png';
  };

  const NavContent = () => (
    <>
      <div className="flex items-center mb-10">
        <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
          <img src={getLogo()} alt="ClickBit Admin" className="h-10" />
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map(link => {
          if (!hasPermission(link.permission)) return null;
          
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive ? 'bg-[#1FBBD2] text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2">
            <p className="font-semibold text-gray-800 dark:text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
          <ThemeToggle />
        </div>
        <Link
          to="/"
          className="w-full flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setSidebarOpen(false)}
        >
          <Home className="h-5 w-5 mr-3" /> Back to Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Unified Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end mb-6 py-6 px-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <NavContent />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 