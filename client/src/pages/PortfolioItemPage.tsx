import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import SiteHead from '../components/SiteHead';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import PortfolioFlipCard from '../components/PortfolioFlipCard';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  slug: string;
  category: string;
  client_name: string;
  technologies: string[];
  services_provided: string[];
  gallery_images: string[];
  featured_image: string;
  cover_image: string;
  live_url: string;
  github_url: string;
  project_date: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface RelatedPortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url?: string;
  cover_image?: string;
  featured_image?: string;
  description: string;
  short_description?: string;
  tags: string[];
  slug?: string;
  live_url?: string;
  externalUrl?: string;
}

const PortfolioItemPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<RelatedPortfolioItem[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await api.get(`/portfolio/${slug}`);
        setItem(response.data);
        setError(null);
        
        // Track Meta Pixel ViewContent event for portfolio view
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'ViewContent', {
            content_type: 'portfolio',
            content_name: response.data.title,
            content_category: response.data.category || 'Portfolio'
          });
        }
      } catch (err) {
        setError('Failed to fetch portfolio item. It might have been moved or deleted.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [slug]);

  useEffect(() => {
    const fetchRelatedProjects = async () => {
      if (!item) return;
      
      try {
        setLoadingRelated(true);
        // First, try to fetch projects from the same category
        const categoryParams = item.category ? { category: item.category, limit: 4 } : { limit: 4 };
        const response = await api.get('/portfolio', { params: categoryParams });
        
        const allProjects = response.data.items || [];
        
        // Filter out the current project and map to RelatedPortfolioItem format
        const related = allProjects
          .filter((project: any) => project.slug !== item.slug && project.id !== item.id)
          .slice(0, 3)
          .map((project: any) => ({
            id: project.id,
            title: project.title,
            category: project.category,
            image_url: project.featured_image || project.cover_image || project.image_url,
            cover_image: project.featured_image || project.cover_image || project.image_url,
            featured_image: project.featured_image || project.cover_image || project.image_url,
            description: project.description || project.short_description || '',
            short_description: project.short_description || project.description?.slice(0, 150),
            tags: Array.isArray(project.technologies) ? project.technologies : (Array.isArray(project.tags) ? project.tags : []),
            slug: project.slug,
            live_url: project.live_url,
            externalUrl: project.live_url || project.externalUrl,
          }));
        
        // If we don't have enough from the same category, fetch more from all projects
        if (related.length < 3) {
          const allResponse = await api.get('/portfolio', { params: { limit: 10 } });
          const allProjectsList = allResponse.data.items || [];
          const additional = allProjectsList
            .filter((project: any) => 
              project.slug !== item.slug && 
              project.id !== item.id &&
              !related.some((r: RelatedPortfolioItem) => r.id === project.id)
            )
            .slice(0, 3 - related.length)
            .map((project: any) => ({
              id: project.id,
              title: project.title,
              category: project.category,
              image_url: project.featured_image || project.cover_image || project.image_url,
              cover_image: project.featured_image || project.cover_image || project.image_url,
              featured_image: project.featured_image || project.cover_image || project.image_url,
              description: project.description || project.short_description || '',
              short_description: project.short_description || project.description?.slice(0, 150),
              tags: Array.isArray(project.technologies) ? project.technologies : (Array.isArray(project.tags) ? project.tags : []),
              slug: project.slug,
              live_url: project.live_url,
              externalUrl: project.live_url || project.externalUrl,
            }));
          
          setRelatedProjects([...related, ...additional]);
        } else {
          setRelatedProjects(related);
        }
      } catch (err) {
        console.error('Error fetching related projects:', err);
        setRelatedProjects([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProjects();
  }, [item]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <PageHeader 
          title="Loading..."
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: 'Loading...', href: '#' }
          ]}
        />
        <div className="text-center py-20">Loading portfolio item...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <PageHeader 
          title="Portfolio Item Not Found"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: 'Not Found', href: '#' }
          ]}
        />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Portfolio Item Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
          <Link to="/portfolio" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const featuredImage = item.featured_image || item.cover_image || '/images/work/project1.jpg';
  const projectDate = new Date(item.project_date || item.created_at).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <SiteHead
        title={item.title}
        description={item.description || `${item.title} - A portfolio project by ClickBIT showcasing ${item.category} development.`}
        image={featuredImage}
        url={`https://clickbit.com.au/portfolio/${item.slug}`}
        type="article"
      />
      
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-white dark:bg-gray-900"
      >
        <PageHeader 
          title={item.title}
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: item.title, href: `/portfolio/${item.slug}` }
          ]}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back to Portfolio */}
          <Link 
            to="/portfolio" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Image */}
              <div className="mb-8">
                <LazyImage
                  src={featuredImage}
                  alt={item.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Project Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Gallery Images */}
              {item.gallery_images && Array.isArray(item.gallery_images) && item.gallery_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {item.gallery_images.map((image, index) => (
                      <div 
                        key={index}
                        className="cursor-pointer"
                        onClick={() => window.open(image, '_blank')}
                      >
                        <LazyImage
                          src={image}
                          alt={`${item.title} gallery image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-28">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Project Details</h3>
                
                {/* Project Date */}
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                    <div className="font-medium">{projectDate}</div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <Tag className="w-5 h-5 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
                    <div className="font-medium">{item.category}</div>
                  </div>
                </div>

                {/* Client */}
                {item.client_name && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client</div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.client_name}</div>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies && Array.isArray(item.technologies) && item.technologies.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Technologies</div>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Provided */}
                {item.services_provided && Array.isArray(item.services_provided) && item.services_provided.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Services Provided</div>
                    <div className="flex flex-wrap gap-2">
                      {item.services_provided.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {item.live_url && (
                    <a
                      href={item.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Site
                    </a>
                  )}
                  
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Projects</h3>
              {loadingRelated ? (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  Loading related projects...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {relatedProjects.map((project) => (
                      <PortfolioFlipCard key={project.id} item={project} />
                    ))}
                  </div>
                  <div className="text-center">
                    <Link 
                      to="/portfolio" 
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      View All Projects
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PortfolioItemPage;
