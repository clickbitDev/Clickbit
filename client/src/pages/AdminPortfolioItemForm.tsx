import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from '../components/ImageUpload';

interface Category {
  id: number;
  name: string;
}

const AdminPortfolioItemForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    tags: '',
    liveUrl: '',
    caseStudyUrl: '',
    externalUrl: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    const fetchItem = async () => {
      if (isEditing && id) {
        setLoading(true);
        try {
          const response = await api.get(`/admin/portfolio/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const item = response.data;
          
          setFormData({
            title: item.title || '',
            category: item.category || '',
            description: item.description || '',
            image: item.cover_image || '',
            tags: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
            liveUrl: item.project_url || '',
            caseStudyUrl: item.github_url || '',
            externalUrl: item.externalUrl || '',
          });
        } catch (err) {
          setError('Failed to load portfolio item data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchItem();
  }, [id, isEditing, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submissionData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      cover_image: formData.image,
      images: formData.image ? [formData.image] : [],
      technologies: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      project_url: formData.liveUrl,
      github_url: formData.caseStudyUrl,
      externalUrl: formData.externalUrl,
    };

    try {
      if (isEditing) {
        await api.put(`/admin/portfolio/${id}`, submissionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/admin/portfolio', submissionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/admin/portfolio');
    } catch (err) {
      setError('Failed to save the item. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div>Loading item...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Edit' : 'Create'} Portfolio Item
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {error && <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input 
              type="text" 
              id="title"
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea 
            id="description"
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            required
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio Image</label>
          <ImageUpload
            value={formData.image}
            onChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
            uploadType="portfolio"
            placeholder="Upload portfolio image"
            className="mb-4"
          />
          <div className="mt-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Or enter image URL manually:</label>
            <input 
              type="text" 
              id="image"
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              placeholder="e.g., /images/work/project.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" 
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags / Technologies</label>
          <input 
            type="text" 
            id="tags"
            name="tags" 
            value={formData.tags} 
            onChange={handleChange} 
            placeholder="Comma-separated tags"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Live URL (optional)</label>
            <input 
              type="url" 
              id="liveUrl"
              name="liveUrl" 
              value={formData.liveUrl} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div>
            <label htmlFor="caseStudyUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Case Study URL (optional)</label>
            <input 
              type="url" 
              id="caseStudyUrl"
              name="caseStudyUrl" 
              value={formData.caseStudyUrl} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">External URL (optional)</label>
            <input 
              type="url" 
              id="externalUrl"
              name="externalUrl" 
              value={formData.externalUrl} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/portfolio')} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortfolioItemForm; 