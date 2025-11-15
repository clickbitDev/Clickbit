import React, { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Image, MessageSquare, Settings, LogOut, Layers, Home, Briefcase, BookOpen, Grid, UserCircle, Menu, X, Star, Mail, Edit, TrendingUp, CreditCard, ShoppingBag, BarChart3, Bell, Activity, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle';
import { notificationsAPI } from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import toast from 'react-hot-toast';

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
  { to: '/admin/uptime-kuma', label: 'Uptime Kuma', icon: Activity, permission: 'dashboard:view' },
  { to: '/admin/external-services', label: 'External Services', icon: Globe, permission: 'dashboard:view' },
];

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationDesktopRef = useRef<HTMLDivElement>(null);
  const notificationMobileRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingNotifications(true);
      const response = await notificationsAPI.getNotifications({ limit: 50, unread_only: false });
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty array on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  // Get socket connection
  const { socket, isConnected, isAuthenticated: socketAuthenticated } = useSocket();

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket || !isConnected || !socketAuthenticated) return;

    const handleNewNotification = (notificationData: any) => {
      // Show toast notification immediately
      const toastMessage = notificationData.title || notificationData.message || 'New notification';
      const toastType = notificationData.type || 'info';
      
      // Show toast based on notification type
      switch (toastType) {
        case 'error':
          toast.error(toastMessage, {
            duration: 5000,
            icon: '🔴',
            position: 'top-right',
          });
          break;
        case 'warning':
          toast(toastMessage, {
            duration: 4000,
            icon: '⚠️',
            position: 'top-right',
            style: {
              background: '#fbbf24',
              color: '#fff',
            },
          });
          break;
        case 'success':
          toast.success(toastMessage, {
            duration: 4000,
            icon: '✅',
            position: 'top-right',
          });
          break;
        default:
          toast(toastMessage, {
            duration: 4000,
            icon: 'ℹ️',
            position: 'top-right',
          });
      }

      // Refresh notifications list to include the new one
      fetchNotifications();
    };

    // Listen for new notification events
    socket.on('notification:new', handleNewNotification);

    // Cleanup listener on unmount
    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, isConnected, socketAuthenticated, fetchNotifications]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const desktopContains = notificationDesktopRef.current?.contains(event.target as Node);
      const mobileContains = notificationMobileRef.current?.contains(event.target as Node);
      
      if (!desktopContains && !mobileContains) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Get theme-appropriate logo (matching public site)
  const getLogo = () => {
    if (theme === 'dark') {
      return '/images/logos/clickbit-logo-single-color-light.png';
    }
    // Use logo-full.png which doesn't have spaces in filename
    return '/images/logos/logo-full.png';
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center mb-6 mt-4">
        <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="flex justify-center">
          <img 
            src={getLogo()} 
            alt="ClickBit Admin" 
            className="h-16 w-auto" 
            loading="eager"
            onError={(e) => {
              console.error('Logo failed to load:', getLogo(), 'Theme:', theme);
              // Fallback to logo-full if the original fails
              if (e.currentTarget.src !== '/images/logos/logo-full.png') {
                e.currentTarget.src = '/images/logos/logo-full.png';
              }
            }}
          />
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

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/"
          className="w-full flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setSidebarOpen(false)}
        >
          <Home className="h-5 w-5 mr-3" /> Back to Site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-screen overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-end mb-6 py-6 px-4 lg:hidden flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <NavContent />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar - Desktop */}
        <header className="hidden lg:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Notification Button */}
            <div className="relative" ref={notificationDesktopRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge - show if there are unread notifications */}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      onClick={() => {/* Navigate to all notifications */}}
                      className="text-sm text-[#1FBBD2] hover:text-[#1a9fb3] font-medium"
                    >
                      See All
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                          onClick={async () => {
                            if (!notification.is_read) {
                              try {
                                await notificationsAPI.markAsRead(notification.id);
                                fetchNotifications();
                              } catch (error) {
                                console.error('Error marking notification as read:', error);
                              }
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {notification.time}
                              </span>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="hidden xl:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-col items-start flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
              {user && (
                <div className="flex items-center space-x-2 -mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative" ref={notificationMobileRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown - Mobile */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <button
                        onClick={() => {/* Navigate to all notifications */}}
                        className="text-sm text-[#1FBBD2] hover:text-[#1a9fb3] font-medium"
                      >
                        See All
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Loading notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                            onClick={async () => {
                              if (!notification.is_read) {
                                try {
                                  await notificationsAPI.markAsRead(notification.id);
                                  fetchNotifications();
                                } catch (error) {
                                  console.error('Error marking notification as read:', error);
                                }
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                  {notification.time}
                                </span>
                              </div>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 pt-1 pb-4 lg:px-8 lg:pt-2 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 