import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Send, MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  date: string;
  isGuest: boolean;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  published_at: string;
  author?: string | {
    id: number;
    first_name: string;
    last_name: string;
  };
  category?: string;
  tags?: string[];
  featured_image?: string;
  metadata?: {
    category?: string;
    tags?: string[];
    featuredImage?: string;
    author?: {
      name: string;
      avatar?: string;
      role?: string;
    };
  };
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await api.get(`/blog/${slug}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch post. It might have been moved or deleted.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-40">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-40">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Link to="/blog" className="mt-6 inline-block bg-[#1FBBD2] text-white px-6 py-2 rounded-full">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-white dark:bg-gray-900"
    >
      <PageHeader
        title={post.title}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` }
        ]}
      />
      <div className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <LazyImage 
              src={post.featured_image || '/images/placeholders/pattern.svg'} 
              alt={post.title} 
              className="w-full rounded-2xl shadow-lg" 
              placeholder="/images/placeholders/pattern.svg"
              fallback="/images/placeholders/pattern.svg"
            />
          </div>
          <div className="flex justify-between items-center mb-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{
                typeof post.author === 'object' && post.author ? 
                  `${post.author.first_name} ${post.author.last_name}` : 
                  post.author || post.metadata?.author?.name || 'ClickBit Team'
              }</span>
            </div>
            <span>Published on {new Date(post.published_at).toLocaleDateString()}</span>
            <span className="font-semibold">
              {post.category || post.metadata?.category || ((post as any).categories && Array.isArray((post as any).categories) ? (post as any).categories[0] : 'General')}
            </span>
          </div>
          <div 
            className="prose dark:prose-invert lg:prose-xl mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(() => {
                try {
                  const tags = post.tags || post.metadata?.tags || (post as any).tags || [];
                  let tagsArray: string[] = [];
                  
                  if (Array.isArray(tags)) {
                    tagsArray = tags;
                  } else if (typeof tags === 'string') {
                    try {
                      tagsArray = JSON.parse(tags);
                      if (!Array.isArray(tagsArray)) tagsArray = [];
                    } catch (e) {
                      tagsArray = [];
                    }
                  }
                  
                  return tagsArray.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {tag}
                    </span>
                  ));
                } catch (error) {
                  console.error('Tags rendering error:', error);
                  return null;
                }
              })()}
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPostPage; 