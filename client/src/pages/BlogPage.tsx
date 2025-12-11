import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import SiteHead from '../components/SiteHead';
import api from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(9);

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
        });

        const uniqueCategories = ['All', ...Array.from(new Set(allCategories))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching blog posts:', err);
        setError(err.message || 'Failed to fetch blog posts');
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
              // If parsing fails, skip
            }
          } else if (Array.isArray(categories) && categories.length > 0) {
            postCategories.push(...categories);
          }
        }
        return postCategories.includes(activeCategory);
      });

  // Pagination logic
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <>
        <SiteHead title="Blog" description="Latest insights, tutorials, and industry news." />
        <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SiteHead title="Blog" description="Latest insights, tutorials, and industry news." />
        <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading blog posts: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHead title="Blog" description="Latest insights, tutorials, and industry news." />
      <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] dark:from-gray-900 dark:to-gray-800">
        <PageHeader 
          title="Our Blog"
          breadcrumbs={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" }
          ]}
        />
        
        <div className="container mx-auto px-4 pb-16 pt-12">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-[#1FBBD2] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#1FBBD2] hover:text-white shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginatedPosts.map(post => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === currentPage
                          ? 'bg-[#1FBBD2] text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Results Info */}
          {totalPosts > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, totalPosts)} of {totalPosts} posts
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </p>
            </div>
          )}

          {/* No Posts Message */}
          {totalPosts === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No posts found{activeCategory !== 'All' && ` in ${activeCategory} category`}.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
