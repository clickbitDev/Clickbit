import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Star, CheckCircle, XCircle, Clock, Edit, Trash2, Eye } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  email?: string;
  company?: string;
  position?: string;
  rating: number;
  review_text: string;
  service_type?: string;
  project_type?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at: string;
  approved_at?: string;
}

interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  featured: number;
}

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    featured: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [filterStatus, currentPage]);

  const fetchReviews = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/reviews/admin?status=${filterStatus}&page=${currentPage}&limit=10`);
      
      setReviews(response.data.reviews);
      setStats(response.data.stats);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId: number, status: string) => {
    if (!token) return;
    
    try {
      await api.put(`/reviews/admin/${reviewId}/status`, { status });
      
      fetchReviews(); // Refresh the list
    } catch (err) {
      console.error('Error updating review status:', err);
      alert('Failed to update review status');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    if (!token) return;
    
    try {
      await api.delete(`/reviews/admin/${reviewId}`);
      
      fetchReviews(); // Refresh the list
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  };

  const handleToggleFeatured = async (reviewId: number, currentFeatured: boolean) => {
    if (!token) return;
    
    try {
      await api.put(`/reviews/admin/${reviewId}`, { is_featured: !currentFeatured }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchReviews(); // Refresh the list
    } catch (err) {
      console.error('Error updating featured status:', err);
      alert('Failed to update featured status');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
    };
    
    const { color, icon: Icon, label } = config[status as keyof typeof config] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
        />
      ))}
    </div>
  );

  if (loading) return <div className="p-8">Loading reviews...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Review Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer reviews and testimonials
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6 col-span-2 sm:col-span-3 md:col-span-1">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rejected</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-purple-600">{stats.featured}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Featured</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-8">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.name}
                        </div>
                        {review.email && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {review.email}
                          </div>
                        )}
                        {(review.company || review.position) && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {review.position && review.company 
                              ? `${review.position} at ${review.company}`
                              : review.position || review.company
                            }
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                        <p className="line-clamp-3">{review.review_text}</p>
                        {review.service_type && (
                          <p className="text-xs text-gray-500 mt-1">Service: {review.service_type}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {getStatusBadge(review.status)}
                        {review.is_featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(review.id, 'approved')}
                              className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(review.id, 'rejected')}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1"
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {review.status === 'approved' && (
                          <button
                            onClick={() => handleToggleFeatured(review.id, review.is_featured)}
                            className={`${review.is_featured ? 'text-purple-600' : 'text-gray-400'} hover:text-purple-900 dark:hover:text-purple-400 p-1`}
                            title={review.is_featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <Star className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {review.name}
                    </div>
                    {review.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {review.email}
                      </div>
                    )}
                    {(review.company || review.position) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {review.position && review.company 
                          ? `${review.position} at ${review.company}`
                          : review.position || review.company
                        }
                      </div>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-900 dark:text-white line-clamp-3">{review.review_text}</p>
                  {review.service_type && (
                    <p className="text-xs text-gray-500 mt-1">Service: {review.service_type}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {getStatusBadge(review.status)}
                  {review.is_featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-3">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(review.id, 'approved')}
                          className="flex items-center text-green-600 hover:text-green-900 dark:hover:text-green-400 text-sm font-medium p-2"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(review.id, 'rejected')}
                          className="flex items-center text-red-600 hover:text-red-900 dark:hover:text-red-400 text-sm font-medium p-2"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => handleToggleFeatured(review.id, review.is_featured)}
                        className={`flex items-center ${review.is_featured ? 'text-purple-600' : 'text-gray-400'} hover:text-purple-900 dark:hover:text-purple-400 text-sm font-medium p-2`}
                        title={review.is_featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {review.is_featured ? 'Unfeature' : 'Feature'}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center text-red-600 hover:text-red-900 dark:hover:text-red-400 text-sm font-medium p-2"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;