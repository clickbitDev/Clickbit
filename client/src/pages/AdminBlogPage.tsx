import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, Calendar, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { teamMembers } from '../services/TEAM_MEMBERS_DATA';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  author: string;
  category: string;
  cover_image?: string;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);
  const { token } = useAuth();

  const fetchPosts = async () => {
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/blog/admin/all');
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    setError(null);
    fetchPosts();
    fetchCategories();
    // eslint-disable-next-line
  }, [token]);

  const handleDelete = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/admin/posts/${postId}`);
        setPosts(Array.isArray(posts) ? posts.filter(p => p.id !== postId) : []);
      } catch (err) {
        setError('Failed to delete post.');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (postId: number, newStatus: string) => {
    try {
      await api.patch(`/admin/posts/${postId}`, 
        { status: newStatus }
      );
      setPosts(Array.isArray(posts) ? posts.map(p => p.id === postId ? { ...p, status: newStatus } : p) : []);
    } catch (err) {
      setError('Failed to update post status.');
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      archived: { color: 'bg-yellow-100 text-yellow-800', label: 'Archived' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const statusMatch = filterStatus === 'all' || post.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || post.category === filterCategory;
    const authorMatch = filterAuthor === 'all' || post.author === filterAuthor;
    return statusMatch && categoryMatch && authorMatch;
  }) : [];

  // Pagination logic
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterCategory, filterAuthor]);

  const uniqueCategories = Array.isArray(posts) ? Array.from(new Set(posts.map(post => post.category))) : [];
  const uniqueAuthors = Array.isArray(posts) ? Array.from(new Set(posts.map(post => post.author))) : [];

  if (loading) return <div className="p-8">Loading posts...</div>;
  if (error) return (
    <div className="text-red-500 p-8">
      {error}
      <button onClick={fetchPosts} className="ml-4 px-3 py-1 bg-blue-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage all blog posts, categories, and content
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/admin/blog/scheduled"
              className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Scheduled Posts
            </Link>
            <Link
              to="/admin/blog/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Post
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Total Posts</h3>
            <p className="text-xl md:text-3xl font-bold text-blue-600">{Array.isArray(posts) ? posts.length : 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Published</h3>
            <p className="text-xl md:text-3xl font-bold text-green-600">{Array.isArray(posts) ? posts.filter(p => p.status === 'published').length : 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Scheduled</h3>
            <p className="text-xl md:text-3xl font-bold text-indigo-600">{Array.isArray(posts) ? posts.filter(p => p.status === 'scheduled').length : 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Drafts</h3>
            <p className="text-xl md:text-3xl font-bold text-gray-600">{Array.isArray(posts) ? posts.filter(p => p.status === 'draft').length : 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
            <p className="text-xl md:text-3xl font-bold text-purple-600">{uniqueCategories.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Authors</option>
                {uniqueAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedPosts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.cover_image && (
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="h-12 w-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{post.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post.id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link 
                      to={`/blog/${post.slug}`} 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    >
                      <Eye className="h-5 w-5 inline" />
                    </Link>
                    <Link 
                      to={`/admin/blog/edit/${post.id}`} 
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {paginatedPosts.map(post => (
            <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start mb-3">
                {post.cover_image && (
                  <img 
                    src={post.cover_image} 
                    alt={post.title}
                    className="h-16 w-20 object-cover rounded mr-3 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {post.title}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <User className="h-3 w-3 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <select
                  value={post.status}
                  onChange={(e) => handleStatusChange(post.id, e.target.value)}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center justify-between space-x-3">
                <div className="flex space-x-3">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    target="_blank"
                    className="flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium p-2"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  <Link 
                    to={`/admin/blog/edit/${post.id}`} 
                    className="flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium p-2"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </div>
                <button 
                  onClick={() => handleDelete(post.id)} 
                  className="flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium p-2"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{startIndex + 1}</span>
                {" "}to{" "}
                <span className="font-medium">{Math.min(endIndex, totalPosts)}</span>
                {" "}of{" "}
                <span className="font-medium">{totalPosts}</span>
                {" "}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-200"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {totalPosts === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No posts found matching your filters.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminBlogPage;
