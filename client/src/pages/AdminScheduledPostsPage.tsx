import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Play, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface ScheduledPost {
  id: number;
  title: string;
  slug: string;
  scheduled_at: string;
  created_at: string;
}

const AdminScheduledPostsPage: React.FC = () => {
  const { token } = useAuth();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingPostId, setPublishingPostId] = useState<number | null>(null);

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/scheduled-posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScheduledPosts(response.data);
    } catch (err: any) {
      setError('Failed to fetch scheduled posts');
      console.error('Error fetching scheduled posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (postId: number) => {
    try {
      setPublishingPostId(postId);
      await api.post(`/admin/scheduled-posts/${postId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the published post from the list
      setScheduledPosts(posts => posts.filter(post => post.id !== postId));
      
      // Show success message
      alert('Post published successfully!');
    } catch (err: any) {
      console.error('Error publishing post:', err);
      alert('Failed to publish post');
    } finally {
      setPublishingPostId(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scheduled Posts</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage posts scheduled for future publication
            </p>
          </div>
          <Link
            to="/admin/blog/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create New Post
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        {scheduledPosts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Scheduled Posts
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any posts scheduled for publication yet.
            </p>
            <Link
              to="/admin/blog/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule a Post
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {scheduledPosts.length} Post{scheduledPosts.length !== 1 ? 's' : ''} Scheduled
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {post.title}
                        </h3>
                        {isOverdue(post.scheduled_at) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Scheduled: {formatDateTime(post.scheduled_at)}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created: {formatDateTime(post.created_at)}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Slug: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{post.slug}</code>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/blog/${post.slug}?preview=true`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Preview Post"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        title="Edit Post"
                      >
                        <Calendar className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => publishPost(post.id)}
                        disabled={publishingPostId === post.id}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors disabled:opacity-50"
                        title="Publish Now"
                      >
                        {publishingPostId === post.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            How Blog Scheduling Works
          </h3>
          <div className="prose dark:prose-invert text-sm">
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Posts with status "Scheduled" will automatically be published when their scheduled time arrives</li>
              <li>The system checks for scheduled posts every minute</li>
              <li>You can manually publish any scheduled post using the play button</li>
              <li>Overdue posts (past their scheduled time) are highlighted in red</li>
              <li>Once published, posts are moved to the regular blog posts list</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScheduledPostsPage; 