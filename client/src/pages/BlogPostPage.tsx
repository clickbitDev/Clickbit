import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import SecureHtmlRenderer from '../components/SecureHtmlRenderer';
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
  contentType?: 'html' | 'markdown';
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
          <SecureHtmlRenderer 
            content={post.content}
            className="mx-auto"
            contentType={post.contentType || (() => {
              // More robust Markdown detection
              const content = post.content || '';
              const hasMarkdownHeaders = /^#+\s/.test(content);
              const hasMarkdownTable = /\|.*\|.*\|/.test(content);
              const hasMarkdownList = /^[\s]*[-*+]\s/.test(content);
              const hasMarkdownBold = /\*\*.*\*\*/.test(content);
              const hasMarkdownItalic = /\*[^*].*\*/.test(content);
              const hasHtmlTags = /<[^>]+>/.test(content);
              
              // If it has Markdown features and no HTML tags, treat as Markdown
              if ((hasMarkdownHeaders || hasMarkdownTable || hasMarkdownList || hasMarkdownBold || hasMarkdownItalic) && !hasHtmlTags) {
                return 'markdown';
              }
              
              // If it has HTML tags, treat as HTML
              if (hasHtmlTags) {
                return 'html';
              }
              
              // Default to Markdown for plain text
              return 'markdown';
            })()}
          />

          {/* JSON-LD Schema Markup for Blog Post */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt || post.title,
                author: {
                  "@type": "Person",
                  name: typeof post.author === 'object' && post.author
                    ? `${post.author.first_name} ${post.author.last_name}`
                    : post.author || post.metadata?.author?.name || 'ClickBit Team'
                },
                publisher: {
                  "@type": "Organization",
                  name: "ClickBit",
                  logo: {
                    "@type": "ImageObject",
                    url: `${window.location.origin}/images/logos/logo-full.png`
                  }
                },
                datePublished: post.published_at,
                                 dateModified: (post as any).updated_at || post.published_at,
                image: post.featured_image || post.metadata?.featuredImage || `${window.location.origin}/images/placeholders/pattern.svg`,
                url: `${window.location.origin}/blog/${post.slug}`,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${window.location.origin}/blog/${post.slug}`
                },
                articleSection: post.category || post.metadata?.category || ((post as any).categories && Array.isArray((post as any).categories) ? (post as any).categories[0] : 'General'),
                keywords: (() => {
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
                    
                    return tagsArray.join(', ');
                  } catch (error) {
                    return '';
                  }
                })(),
                wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0
              })
            }}
          />
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPostPage; 