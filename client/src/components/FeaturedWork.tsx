import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import PortfolioFlipCard from './PortfolioFlipCard';

import api from '../services/api';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url?: string;
  cover_image?: string;
  featured_image?: string;
  description: string;
  short_description?: string;
  externalUrl?: string;
  live_url?: string;
  tags: string[];
  slug?: string;
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
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const [lightboxDescription, setLightboxDescription] = useState<string>('');

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/portfolio/featured?limit=6');
        const portfolioData = response.data.items || [];
        
        // Defensive check: ensure portfolioData is an array
        if (Array.isArray(portfolioData)) {
          // Get the latest 6 items for gallery display
          const latestItems = portfolioData.slice(0, 6).map((item: any) => ({
            ...item,
            image_url: item.featured_image || item.cover_image || item.image_url,
            cover_image: item.featured_image || item.cover_image || item.image_url,
            tags: Array.isArray(item.technologies) ? item.technologies : (Array.isArray(item.tags) ? item.tags : []),
            externalUrl: item.live_url || item.externalUrl,
            // Ensure slug is properly mapped
            slug: item.slug,
            // Ensure description is available for lightbox
            description: item.description || item.short_description,
          }));
          setPortfolioItems(latestItems);
        } else {
          console.warn('Featured portfolio data is not an array:', portfolioData);
          setPortfolioItems([]);
        }
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
    console.log('Portfolio item clicked:', item);
    console.log('Item slug:', item.slug);
    console.log('Item externalUrl:', item.externalUrl);
    console.log('Item live_url:', item.live_url);
    
    // If item has slug, navigate to individual portfolio page using React Router
    if (item.slug) {
      console.log('Navigating to portfolio page:', `/portfolio/${item.slug}`);
      navigate(`/portfolio/${item.slug}`);
    } else if (item.externalUrl || item.live_url) {
      // Open external URL if available
      console.log('Opening external URL:', item.externalUrl || item.live_url);
      window.open(item.externalUrl || item.live_url, '_blank', 'noopener,noreferrer');
    } else {
      // Show lightbox with portfolio details
      console.log('Showing lightbox for item:', item.title);
      setLightboxImage(item.cover_image || item.image_url || '/images/work/project1.jpg');
      setLightboxTitle(item.title);
      setLightboxDescription(item.description || item.short_description || '');
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxTitle('');
    setLightboxDescription('');
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
              We take pride in projects powered by our services. Check out our excellent team and the <Link to="/portfolio" className="text-[#1FBBD2] hover:text-[#1A9DAA] font-semibold underline">complete portfolio they've crafted</Link>, showcasing our expertise and commitment to delivering exceptional results.
            </p>
          </div>



          {/* Image Gallery Grid with Flip Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((project) => (
              <PortfolioFlipCard 
                key={project.id}
                item={project} 
                onClick={handleImageClick}
              />
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
          <div className="relative max-w-4xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={lightboxImage}
                  alt={lightboxTitle}
                  className="w-full h-64 lg:h-full object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                {lightboxTitle && (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {lightboxTitle}
                  </h3>
                )}
                {lightboxDescription && (
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {lightboxDescription}
                  </p>
                )}
                <div className="flex gap-3">
                  <Link 
                    to="/portfolio" 
                    className="bg-[#1FBBD2] hover:bg-[#1A9DAA] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View All Projects
                  </Link>
                  <button
                    onClick={closeLightbox}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedWork; 