import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { teamMembers } from '../services/TEAM_MEMBERS_DATA';
import { Upload, X, Image as ImageIcon, Save, Eye } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const AdminBlogPostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = Boolean(id);

  // Auto-generate slug from title when not editing and slug hasn't been manually edited
  useEffect(() => {
    if (!isEditing && !slugManuallyEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isEditing, slugManuallyEdited]);

  // Fetch categories
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
    const fetchPost = async () => {
      if (isEditing && id) {
        setLoading(true);
        try {
          const response = await api.get(`/admin/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const post = response.data;
          
          setTitle(post.title || '');
          setSlug(post.slug || '');
          setContent(post.content || '');
          setExcerpt(post.excerpt || '');
          setCategory(post.category || '');
          setStatus(post.status || 'draft');
          setFeaturedImage(post.featured_image || '');
          setTags(post.tags ? post.tags.join(', ') : '');
        } catch (err) {
          setError('Failed to load post data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [id, isEditing, token]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugManuallyEdited(true);
  };

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required to save a draft.');
      return;
    }

    setLoading(true);
    setError(null);

    const draftData = {
      title,
      slug: slug || generateSlug(title),
      content,
      excerpt,
      category: category || 'General',
      status: 'draft',
      featured_image: featuredImage,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await api.put(`/admin/posts/${id}`, draftData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/admin/posts', draftData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 3000);
    } catch (err: any) {
      console.error('Draft save error:', err);
      setError('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }
    if (!category.trim()) {
      setError('Category is required.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const submissionData = {
      title,
      slug,
      content,
      excerpt,
      category,
      status,
      featured_image: featuredImage,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    
    console.log('Blog submission data:', submissionData);
    console.log('Featured image value:', featuredImage);

    try {
      if (isEditing) {
        await api.put(`/admin/posts/${id}`, submissionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/admin/posts', submissionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/admin/blog');
    } catch (err: any) {
      console.error('Blog post submission error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save the post. Please check the fields.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="p-8">Loading post...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {error && <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={handleTitleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug *</label>
              <input 
                type="text" 
                id="slug" 
                value={slug} 
                onChange={handleSlugChange}
                required
                placeholder="auto-generated from title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                URL-friendly version of the title
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt</label>
            <textarea 
              id="excerpt" 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              rows={3}
              placeholder="Brief summary of the post..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A short summary that appears in blog listings
            </p>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
            <ImageUpload
              value={featuredImage}
              onChange={(imageUrl) => setFeaturedImage(imageUrl)}
              uploadType="blog"
              placeholder="Upload blog featured image"
              className="mb-4"
            />
            <div className="mt-2">
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Or enter image URL manually:</label>
              <input
                type="text"
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                placeholder="/images/uploads/blog/image.jpg or https://example.com/image.jpg"
              />
            </div>
          </div>


          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter tags separated by commas (e.g., technology, web development, react)"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Separate multiple tags with commas
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content *</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
              height={500}
              onSaveDraft={handleSaveDraft}
              isDraft={isDraftSaved}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Use the rich text editor to format your content, or switch to HTML source for advanced editing.
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select 
              id="status" 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              onClick={() => navigate('/admin/blog')} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !title.trim() || !slug.trim() || !content.trim() || !category.trim()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogPostForm; 