import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  guest_email?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  currency: string;
  items_count: number;
  created_at: string;
  updated_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState({ field: 'created_at', direction: 'desc' });
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchTerm, currentPage, sorting]);

  const fetchOrders = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const params = {
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: 20,
        sortBy: sorting.field,
        sortOrder: sorting.direction
      };

      const response = await api.get('/admin/orders', { params });
      
      setOrders(response.data.orders || []);
      setStats(response.data.stats || stats);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, status: string) => {
    if (!token) return;
    
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const handleSort = (field: string) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { color: 'bg-purple-100 text-purple-800', icon: Package },
      shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      refunded: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      paid: { color: 'bg-green-100 text-green-800' },
      failed: { color: 'bg-red-100 text-red-800' },
      refunded: { color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="p-8">Loading orders...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer orders and track sales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6 col-span-2 sm:col-span-3 md:col-span-2">
            <div className="flex items-center">
              <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-2 md:ml-3">
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6 col-span-2 sm:col-span-3 md:col-span-2">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <div className="ml-2 md:ml-3">
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.revenue)}</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-blue-600">{stats.confirmed}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Confirmed</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-purple-600">{stats.processing}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Processing</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-green-600">{stats.delivered}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Delivered</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-8">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between md:space-x-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table/Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('order_number')}
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Order
                      {sorting.field === 'order_number' && (
                        sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('total_amount')}
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Total
                      {sorting.field === 'total_amount' && (
                        sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('created_at')}
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Date
                      {sorting.field === 'created_at' && (
                        sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{order.order_number}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customer 
                            ? `${order.customer.first_name} ${order.customer.last_name}`
                            : 'Guest'
                          }
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.customer?.email || order.guest_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.total_amount, order.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1"
                          title="View order details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {orders.map((order) => (
              <div key={order.id} className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      #{order.order_number}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {order.items_count} item{order.items_count !== 1 ? 's' : ''} • {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(order.total_amount, order.currency)}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.customer 
                      ? `${order.customer.first_name} ${order.customer.last_name}`
                      : 'Guest'
                    }
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {order.customer?.email || order.guest_email}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-3">
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 text-sm font-medium p-2"
                    title="View order details"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
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

        {orders.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {filterStatus !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers make purchases'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage; 