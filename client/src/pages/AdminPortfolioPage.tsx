import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, Calendar, User, Tag, Image } from 'lucide-react';
import { teamMembers } from '../services/TEAM_MEMBERS_DATA';

interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  client?: string;
  technologies: string[];
  images: string[];
  cover_image?: string;
  featured_image?: string;
  project_url?: string;
  github_url?: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const AdminPortfolioPage: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');
  const { token } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get('/portfolio/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = response.data.items || [];
        // Parse JSON fields that come as strings
        const parsedItems = items.map((item: any) => ({
          ...item,
          technologies: Array.isArray(item.technologies) 
            ? item.technologies 
            : (typeof item.technologies === 'string' ? JSON.parse(item.technologies || '[]') : []),
          services_provided: Array.isArray(item.services_provided) 
            ? item.services_provided 
            : (typeof item.services_provided === 'string' ? JSON.parse(item.services_provided || '[]') : []),
          gallery_images: Array.isArray(item.gallery_images) 
            ? item.gallery_images 
            : (typeof item.gallery_images === 'string' ? JSON.parse(item.gallery_images || '[]') : [])
        }));
        setItems(parsedItems);
      } catch (err) {
        setError('Failed to fetch portfolio items.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchItems();
    fetchCategories();
  }, [token]);

  const handleDelete = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await api.delete(`/portfolio/admin/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(items.filter(i => i.id !== itemId));
      } catch (err) {
        setError('Failed to delete item.');
      }
    }
  };

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      await api.patch(`/portfolio/admin/${itemId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(items.map(i => i.id === itemId ? { ...i, status: newStatus } : i));
    } catch (err) {
      setError('Failed to update portfolio status.');
      console.error(err);
    }
  };

  const handleFeaturedToggle = async (itemId: number, featured: boolean) => {
    try {
      await api.patch(`/admin/portfolio/${itemId}`, 
        { featured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(items.map(i => i.id === itemId ? { ...i, featured } : i));
    } catch (err) {
      setError('Failed to update featured status.');
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      featured: { color: 'bg-purple-100 text-purple-800', label: 'Featured' },
      archived: { color: 'bg-yellow-100 text-yellow-800', label: 'Archived' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredItems = Array.isArray(items) ? items.filter(item => {
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const authorMatch = filterAuthor === 'all' || item.author === filterAuthor;
    return statusMatch && categoryMatch && authorMatch;
  }) : [];

  const uniqueCategories = Array.isArray(items) ? Array.from(new Set(items.map(item => item.category))) : [];
  const uniqueAuthors = Array.isArray(items) ? Array.from(new Set(items.map(item => item.author))) : [];

  if (loading) return <div className="p-8">Loading portfolio items...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage all portfolio items, projects, and showcases
              </p>
            </div>
            <Link
              to="/admin/portfolio/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Item
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{Array.isArray(items) ? items.length : 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Published</h3>
              <p className="text-3xl font-bold text-green-600">{Array.isArray(items) ? items.filter(i => i.status === 'published').length : 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Featured</h3>
              <p className="text-3xl font-bold text-purple-600">{Array.isArray(items) ? items.filter(i => i.featured).length : 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
              <p className="text-3xl font-bold text-orange-600">{uniqueCategories.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="featured">Featured</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
                <select
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {(item.cover_image || item.featured_image) ? (
                  <img 
                    src={item.cover_image || item.featured_image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Meta Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    {item.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Tag className="h-4 w-4 mr-2" />
                    {item.category}
                  </div>
                  {item.client && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Client: {item.client}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Featured:</span>
                    <button
                      onClick={() => handleFeaturedToggle(item.id, !item.featured)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        item.featured ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          item.featured ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.slice(0, 3).map((tech, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {item.technologies.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          +{item.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Link 
                      to={`/portfolio/${item.slug}`} 
                      target="_blank"
                      className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link 
                      to={`/admin/portfolio/edit/${item.id}`} 
                      className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No portfolio items found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolioPage; 