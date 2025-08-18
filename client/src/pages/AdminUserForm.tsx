import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AdminUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'customer',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          const user = response.data;
          setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status,
          });
        })
        .catch(() => setError('Failed to load user data.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await api.put(`/users/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/users', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/admin/users');
    } catch (err) {
      setError('Failed to save the user. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div>Loading user...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Edit' : 'Create'} {user?.role === 'manager' ? 'Customer' : 'User'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {error && <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{isEditing ? 'New Password' : 'Password'}</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              disabled={user?.role === 'manager'}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-600"
            >
              <option value="customer">Customer</option>
              {user?.role === 'admin' && (
                <>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </>
              )}
            </select>
            {user?.role === 'manager' && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Managers can only create customer accounts
              </p>
            )}
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/admin/users')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-800">
            {loading ? 'Saving...' : `Save ${user?.role === 'manager' ? 'Customer' : 'User'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;