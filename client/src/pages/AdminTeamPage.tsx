import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LazyImage from '../components/LazyImage';
import ImageUpload from '../components/ImageUpload';
import { Pencil, Trash2, Plus, User } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  role_label: string;
  image: string;
  email: string;
  phone: string;
  bio: string;
  linkedin: string;
  display_order: number;
  is_active: boolean;
}

const AdminTeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    role_label: '',
    image: '',
    email: '',
    phone: '',
    bio: '',
    linkedin: '',
    display_order: 0,
    is_active: true
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team');
      setTeamMembers(response.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.put(`/team/${editingMember.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/team', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTeamMembers();
      resetForm();
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Failed to save team member');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      await api.delete(`/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeamMembers();
    } catch (err) {
      console.error('Error deleting team member:', err);
      alert('Failed to delete team member');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      role_label: member.role_label || '',
      image: member.image || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      linkedin: member.linkedin || '',
      display_order: member.display_order,
      is_active: member.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      role_label: '',
      image: '',
      email: '',
      phone: '',
      bio: '',
      linkedin: '',
      display_order: 0,
      is_active: true
    });
    setEditingMember(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-8">Loading team members...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Team</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 text-sm bg-[#1FBBD2] text-white rounded-lg hover:bg-[#1A9DAA] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role Label
                  </label>
                  <input
                    type="text"
                    value={formData.role_label}
                    onChange={(e) => setFormData({ ...formData, role_label: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Image
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                    uploadType="team"
                    placeholder="Upload team member photo"
                    className="w-full"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-[#1FBBD2] text-white rounded-md hover:bg-[#1A9DAA]"
                >
                  {editingMember ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.image ? (
                          <LazyImage 
                            src={member.image} 
                            alt={member.name} 
                            className="h-10 w-10 rounded-full object-cover" 
                            placeholder="/images/placeholders/pattern.svg"
                            fallback="/images/placeholders/pattern.svg"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          {member.role_label && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {member.role_label}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {member.email && <div>{member.email}</div>}
                        {member.phone && <div>{member.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{member.display_order}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-[#1FBBD2] hover:text-[#1A9DAA] mr-3 p-1"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {teamMembers.map((member) => (
              <div key={member.id} className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start mb-3">
                  {member.image ? (
                    <LazyImage 
                      src={member.image} 
                      alt={member.name} 
                      className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" 
                      placeholder="/images/placeholders/pattern.svg"
                      fallback="/images/placeholders/pattern.svg"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <User className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {member.role}
                    </div>
                    {member.role_label && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role_label}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Order: {member.display_order}
                  </div>
                </div>

                {(member.email || member.phone) && (
                  <div className="mb-3">
                    {member.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.email}
                      </div>
                    )}
                    {member.phone && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {member.phone}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                    member.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex items-center text-[#1FBBD2] hover:text-[#1A9DAA] text-sm font-medium p-2"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium p-2"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeamPage;