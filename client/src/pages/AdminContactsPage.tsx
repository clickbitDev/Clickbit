import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Trash2, ChevronUp, ChevronDown, Download, CheckSquare, Square } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contact_type: 'general' | 'support' | 'sales' | 'feedback' | 'complaint' | 'partnership' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'read' | 'in_progress' | 'replied' | 'resolved' | 'closed';
  source?: string;
  custom_fields?: any;
  created_at: string;
  updated_at: string;
  assignedUser?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface ContactStats {
  stats: any[];
  unreadCount: number;
  overdueCount: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const AdminContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats>({ stats: [], unreadCount: 0, overdueCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    contact_type: '',
    priority: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sorting, setSorting] = useState({
    field: 'created_at',
    direction: 'desc' as 'asc' | 'desc'
  });
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchContacts();
      fetchStats();
    }
  }, [filters, sorting, pagination.currentPage, token]);

  const fetchContacts = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy: sorting.field,
        sortOrder: sorting.direction.toUpperCase(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
      });

      const response = await api.get(`/admin/contacts?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.contacts) {
        setContacts(response.data.contacts);
        
        // Ensure pagination data has default values
        const paginationData = response.data.pagination || {};
        setPagination({
          currentPage: paginationData.currentPage || 1,
          totalPages: paginationData.totalPages || 1,
          totalItems: paginationData.totalItems || 0,
          itemsPerPage: paginationData.itemsPerPage || 20
        });
      } else {
        setContacts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20
        });
      }
    } catch (err: any) {
      setError('Failed to fetch contacts');
      console.error(err);
      setContacts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!token) return;

    try {
      const response = await api.get('/admin/contacts/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setStats({
          stats: response.data.stats || [],
          unreadCount: response.data.unreadCount || 0,
          overdueCount: response.data.overdueCount || 0
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
      setStats({ stats: [], unreadCount: 0, overdueCount: 0 });
    }
  };

  const handleSort = (field: string) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const toggleSelectContact = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (!token || selectedContacts.length === 0) return;

    try {
      await Promise.all(
        selectedContacts.map(contactId =>
          api.put(`/admin/contacts/${contactId}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      
      setContacts(prev => prev.map(contact => 
        selectedContacts.includes(contact.id) 
          ? { ...contact, status: status as any } 
          : contact
      ));
      setSelectedContacts([]);
      setShowBulkActions(false);
    } catch (err: any) {
      setError('Failed to update contacts');
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (!token || selectedContacts.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedContacts.map(contactId =>
          api.delete(`/admin/contacts/${contactId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      
      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
      setShowBulkActions(false);
    } catch (err: any) {
      setError('Failed to delete contacts');
      console.error(err);
    }
  };

  const handleExport = async () => {
    if (!token) return;

    try {
      const params = new URLSearchParams({
        export: 'true',
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
      });

      const response = await api.get(`/admin/contacts/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to export contacts');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (contactId: number, status: string) => {
    if (!token) return;

    try {
      await api.put(`/admin/contacts/${contactId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, status: status as any } : contact
      ));
    } catch (err: any) {
      setError('Failed to update status');
      console.error(err);
    }
  };

  const handlePriorityUpdate = async (contactId: number, priority: string) => {
    if (!token) return;

    try {
      await api.put(`/admin/contacts/${contactId}/priority`, { priority }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, priority: priority as any } : contact
      ));
    } catch (err: any) {
      setError('Failed to update priority');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete || !token) return;

    try {
      await api.delete(`/admin/contacts/${contactToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refetch contacts or filter out locally
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      setContactToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err: any) {
      setError('Failed to delete contact');
      console.error(err);
    }
  };

  const openDeleteConfirm = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return 'General';
      case 'support': return 'Support';
      case 'sales': return 'Sales';
      case 'feedback': return 'Feedback';
      case 'complaint': return 'Complaint';
      case 'partnership': return 'Partnership';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading contacts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all form submissions including contact forms and project requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Unread Messages</h3>
            <p className="text-xl md:text-3xl font-bold text-blue-600">{stats.unreadCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Overdue (24h+)</h3>
            <p className="text-xl md:text-3xl font-bold text-red-600">{stats.overdueCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6 sm:col-span-2 md:col-span-1">
            <h3 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">Total Contacts</h3>
            <p className="text-xl md:text-3xl font-bold text-gray-600 dark:text-gray-400">{pagination.totalItems}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="in_progress">In Progress</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.contact_type}
                onChange={(e) => handleFilterChange('contact_type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: '', contact_type: '', priority: '', search: '', dateFrom: '', dateTo: '' });
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
              >
                <Download size={14} className="mr-1" />
                Export
              </button>
            </div>
            {selectedContacts.length > 0 && (
              <>
                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Bulk ({selectedContacts.length})
                  </button>
                </div>
                {showBulkActions && (
                  <>
                    <div className="flex items-end">
                      <select
                        onChange={(e) => e.target.value && handleBulkStatusUpdate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        value=""
                      >
                        <option value="">Set Status</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="in_progress">In Progress</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleBulkDelete}
                        className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {contacts.length === 0 && !loading ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2M9 7h6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No contacts found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {Object.values(filters).some(filter => filter !== '') 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'No contact submissions have been received yet.'}
              </p>
              {Object.values(filters).some(filter => filter !== '') && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setFilters({ status: '', contact_type: '', priority: '', search: '', dateFrom: '', dateTo: '' });
                      setPagination(prev => ({ ...prev, currentPage: 1 }));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          {selectedContacts.length === contacts.length && contacts.length > 0 ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          Contact
                          {sorting.field === 'name' && (
                            sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('subject')}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          Subject
                          {sorting.field === 'subject' && (
                            sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('contact_type')}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          Type
                          {sorting.field === 'contact_type' && (
                            sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          Status
                          {sorting.field === 'status' && (
                            sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('priority')}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          Priority
                          {sorting.field === 'priority' && (
                            sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('created_at')}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          Date
                          {sorting.field === 'created_at' && (
                            sorting.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleSelectContact(contact.id)}
                            className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1"
                          >
                            {selectedContacts.includes(contact.id) ? (
                              <CheckSquare size={16} />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {contact.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {getContactTypeLabel(contact.contact_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={contact.status}
                            onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(contact.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="in_progress">In Progress</option>
                            <option value="replied">Replied</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={contact.priority}
                            onChange={(e) => handlePriorityUpdate(contact.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(contact.priority)}`}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(contact.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(contact)}
                            className="text-red-600 hover:text-red-900 ml-4 p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() => toggleSelectContact(contact.id)}
                          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1 mt-1"
                        >
                          {selectedContacts.includes(contact.id) ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {contact.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(contact.created_at)}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {contact.subject}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getContactTypeLabel(contact.contact_type)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(contact.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="in_progress">In Progress</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        value={contact.priority}
                        onChange={(e) => handlePriorityUpdate(contact.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(contact.priority)}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between space-x-3">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowModal(true);
                        }}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 text-sm font-medium p-2"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(contact)}
                        className="flex items-center text-red-600 hover:text-red-900 text-sm font-medium p-2"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {showDeleteConfirm && contactToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-md m-auto flex-col flex rounded-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete the contact from "{contactToDelete.name}"?</p>
              <div className="mt-8 flex justify-end space-x-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

        {showModal && selectedContact && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-2xl m-auto flex-col flex rounded-lg">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Contact Details
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                    <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Name:</strong> {selectedContact.name}</p>
                      <p><strong>Email:</strong> {selectedContact.email}</p>
                      {selectedContact.phone && <p><strong>Phone:</strong> {selectedContact.phone}</p>}
                      <p><strong>Subject:</strong> {selectedContact.subject}</p>
                      <p><strong>Type:</strong> {getContactTypeLabel(selectedContact.contact_type)}</p>
                      <p><strong>Source:</strong> {selectedContact.source || 'Not specified'}</p>
                      <p><strong>Submitted:</strong> {formatDate(selectedContact.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Message</h4>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  {selectedContact.custom_fields && Object.keys(selectedContact.custom_fields).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Project Details</h4>
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                          {JSON.stringify(selectedContact.custom_fields, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactsPage; 