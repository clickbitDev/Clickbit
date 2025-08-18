import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  metadata: {
    category: string;
    featuredImage: string;
  };
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // Add timestamp to prevent caching issues
        const response = await api.get(`/blog?t=${Date.now()}`);
        const blogPosts: BlogPost[] = response.data.posts || response.data;
        setPosts(blogPosts);

        // Extract categories from both old format (metadata.category) and new format (categories array)
        const allCategories = blogPosts.flatMap(post => {
          if (post.metadata?.category) return [post.metadata.category];
          
          const categories = (post as any).categories;
          if (categories) {
            // Handle both string and array formats
            if (typeof categories === 'string') {
              try {
                const parsed = JSON.parse(categories);
                return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['General'];
              } catch {
                return ['General'];
              }
            } else if (Array.isArray(categories) && categories.length > 0) {
              return categories;
            }
          }
          return ['General'];
        }).filter(Boolean);
        
        const uniqueCategories = ['All', ...Array.from(new Set(allCategories))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => {
        const postCategories = [];
        if (p.metadata?.category) postCategories.push(p.metadata.category);
        
        const categories = (p as any).categories;
        if (categories) {
          // Handle both string and array formats
          if (typeof categories === 'string') {
            try {
              const parsed = JSON.parse(categories);
              if (Array.isArray(parsed) && parsed.length > 0) {
                postCategories.push(...parsed);
              }
            } catch {
              // If parsing fails, continue
            }
          } else if (Array.isArray(categories) && categories.length > 0) {
            postCategories.push(...categories);
          }
        }
        
        if (postCategories.length === 0) postCategories.push('General');
        return postCategories.includes(activeCategory);
      });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <PageHeader 
          title="From Our Blog"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]}
        />
        <div className="text-center py-20">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <PageHeader 
          title="From Our Blog"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]}
        />
        <div className="text-center py-20 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <PageHeader 
        title="From Our Blog"
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 text-sm rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#1FBBD2] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.map(post => (
            <motion.div key={post.id} variants={itemVariants}>
              <Link to={`/blog/${post.slug}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full">
                  <div className="overflow-hidden">
                    <img 
                      src={post.metadata?.featuredImage || (post as any).featured_image || '/images/placeholders/pattern.svg'} 
                      alt={post.title} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">
                      {post.metadata?.category || (() => {
                        const categories = (post as any).categories;
                        if (categories) {
                          // Handle both string and array formats
                          if (typeof categories === 'string') {
                            try {
                              const parsed = JSON.parse(categories);
                              return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'General';
                            } catch {
                              return 'General';
                            }
                          } else if (Array.isArray(categories) && categories.length > 0) {
                            return categories[0];
                          }
                        }
                        return 'General';
                      })()}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 group-hover:text-[#1FBBD2] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage; 