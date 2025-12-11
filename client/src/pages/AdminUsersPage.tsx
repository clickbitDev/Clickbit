import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ShieldCheck, ShieldX, Trash2, Edit, User, Users, Crown, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(Array.isArray(users) ? users.filter(u => u.id !== userId) : []);
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.role === 'manager' ? 'Customer Management' : 'User Management'}
              </h1>
              {user?.role === 'manager' && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage customer accounts only
                </p>
              )}
            </div>
            <Link to="/admin/users/new" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {user?.role === 'manager' ? 'Customer' : 'User'}
            </Link>
          </div>
        </div>

        {/* Users Table/Cards */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array.isArray(users) ? users.map(userItem => (
                  <tr key={userItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{userItem.first_name} {userItem.last_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{userItem.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Shield className="h-4 w-4 mr-1" />
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userItem.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/users/edit/${userItem.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 p-1">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button onClick={() => handleDelete(userItem.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {Array.isArray(users) ? users.map(userItem => (
              <div key={userItem.id} className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start mb-3">
                  <User className="h-8 w-8 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {userItem.first_name} {userItem.last_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                      {userItem.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                    {userItem.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userItem.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {userItem.status}
                  </span>
                </div>

                <div className="flex items-center justify-between space-x-3">
                  <Link 
                    to={`/admin/users/edit/${userItem.id}`} 
                    className="flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium p-2"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(userItem.id)} 
                    className="flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium p-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage; 