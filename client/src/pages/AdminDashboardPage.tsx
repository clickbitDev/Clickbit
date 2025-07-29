import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Image, 
  MessageSquare,
  Eye,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle,
  Cloud,
  Database,
  Activity,
  Settings,
  Zap
} from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  blogPost?: {
    title: string;
  };
  portfolioItem?: {
    title: string;
  };
}

interface DashboardStats {
  totalUsers: number;
  totalBlogPosts: number;
  totalPortfolioItems: number;
  pendingComments: number;
}

const AdminDashboardPage: React.FC = () => {
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogPosts: 0,
    totalPortfolioItems: 0,
    pendingComments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        
        const commentsResponse = await api.get('/admin/comments/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingComments(commentsResponse.data);
        
        const statsResponse = await api.get('/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsResponse.data);
        
        setError(null);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleUpdateCommentStatus = async (commentId: number, status: 'approved' | 'rejected') => {
    if (!token) {
      setError('Authentication token not found.');
      return;
    }
    try {
      await api.put(`/admin/comments/${commentId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      setStats(prev => ({ ...prev, pendingComments: prev.pendingComments - 1 }));
    } catch (err) {
      setError(`Failed to ${status === 'approved' ? 'approve' : 'reject'} the comment.`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.first_name}! Here's what's happening with your website.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBlogPosts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Image className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPortfolioItems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Comments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingComments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">External Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://crm.clickbit.com.au/app-admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">CRM Admin</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Management</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage customer relationships and sales pipeline</p>
            </a>

            <a 
              href="https://team.crm.clickbit.com.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Team CRM</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Collaboration</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Team access to CRM system and shared data</p>
            </a>

            <a 
              href="https://status.clickbit.com.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Uptime Kuma</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">System Monitoring</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monitor system status and uptime</p>
            </a>

            <a 
              href="https://cloud.clickbit.com.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">ClickCloud</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cloud Services</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cloud infrastructure and hosting management</p>
            </a>

            <a 
              href="https://automation.clickbit.com.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Zap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">N8N</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Workflow Automation</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Automate workflows and business processes</p>
            </a>
          </div>
        </div>

        {/* Quick Actions & Content Overview have been simplified and merged */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/blog/new" className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">Create New Blog Post</span>
              </Link>
              <Link to="/admin/portfolio/new" className="flex items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <Image className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">Add Portfolio Item</span>
              </Link>
              <Link to="/admin/users" className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-green-700 dark:text-green-300 font-medium">Manage Users</span>
              </Link>
              <Link to="/admin/contacts" className="flex items-center p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors">
                <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3" />
                <span className="text-teal-700 dark:text-teal-300 font-medium">Manage Contacts</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Comments</h2>
            <div className="space-y-6">
              {pendingComments.length > 0 ? (
                pendingComments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">{comment.author_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{comment.author_email}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          On post: 
                          <span className="font-medium">
                            {comment.blogPost?.title || comment.portfolioItem?.title || 'Unknown'}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 ml-4">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-4 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {comment.content}
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <button 
                        onClick={() => handleUpdateCommentStatus(comment.id, 'approved')}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateCommentStatus(comment.id, 'rejected')}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending comments</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    All comments have been reviewed. Check back later for new submissions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 