import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import LogoCloud from './LogoCloud';
import api from '../services/api';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url?: string;
  cover_image?: string;
  description: string;
  externalUrl?: string;
  tags: string[];
}

// Fallback static data in case API fails
const staticPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    category: "Web Development",
    cover_image: "/images/work/project1.jpg",
    description: "Modern e-commerce solution with advanced features and seamless user experience.",
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 2,
    title: "Mobile Banking App",
    category: "Mobile Development",
    cover_image: "/images/work/project2.jpg",
    description: "Secure and intuitive mobile banking application for iOS and Android.",
    tags: ["React Native", "API Integration"]
  },
  {
    id: 3,
    title: "Cloud Infrastructure",
    category: "Cloud Solutions",
    cover_image: "/images/work/project3.jpg",
    description: "Scalable cloud infrastructure setup with automated deployment and monitoring.",
    tags: ["AWS", "Docker", "Kubernetes"]
  }
];

const FeaturedWork = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/portfolio/featured?limit=6');
        const portfolioData = response.data.items || response.data;
        // Get the latest 6 items for gallery display
        const latestItems = portfolioData.slice(0, 6).map((item: any) => ({
          ...item,
          image_url: item.featured_image || item.cover_image || item.image_url,
          cover_image: item.featured_image || item.cover_image || item.image_url,
          tags: Array.isArray(item.technologies) ? item.technologies : (Array.isArray(item.tags) ? item.tags : []),
          externalUrl: item.live_url || item.externalUrl,
        }));
        setPortfolioItems(latestItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
        setError('Failed to load portfolio items');
        // Use fallback data if API fails
        setPortfolioItems(staticPortfolioItems);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const handleImageClick = (item: PortfolioItem) => {
    if (item.externalUrl) {
      // Open external URL in new tab
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Open lightbox
      setLightboxImage(item.cover_image || item.image_url || '/images/work/project1.jpg');
      setLightboxTitle(item.title);
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxTitle('');
  };

  if (loading) {
    return (
      <div id="work" className="bg-white dark:bg-[#17283B] py-16 md:py-24 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Our <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">Featured Work</span>
            </h2>
          </div>
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FBBD2]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || portfolioItems.length === 0) {
    return (
      <div id="work" className="bg-white dark:bg-[#17283B] py-16 md:py-24 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Our <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">Featured Work</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {error || 'No portfolio items available at the moment.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="work" className="bg-white dark:bg-[#17283B] py-16 md:py-24 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Our <span className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] text-transparent bg-clip-text">Featured Work</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our portfolio of innovative digital solutions. Click on any image to view details or visit the live project.
            </p>
          </div>

          <div className="mb-16">
            <p className="text-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-widest mb-6">Trusted By The Best</p>
            <LogoCloud />
          </div>

          {/* Image Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((project) => (
              <div 
                key={project.id} 
                className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => handleImageClick(project)}
              >
                {/* Main Image */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={project.cover_image || project.image_url || '/images/work/project1.jpg'} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    onError={(e) => {
                      e.currentTarget.src = '/images/work/project1.jpg';
                    }}
                  />
                </div>

                {/* Overlay with description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1FBBD2]">
                        {project.category}
                      </span>
                      {project.externalUrl && (
                        <ExternalLink className="h-4 w-4 text-white/80" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-white/90 line-clamp-2">{project.description}</p>
                  </div>
                </div>

                {/* Click indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.externalUrl ? (
                    <ExternalLink className="h-4 w-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {lightboxTitle && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-bold">{lightboxTitle}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedWork; 