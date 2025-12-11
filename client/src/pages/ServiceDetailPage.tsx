import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import SiteHead from '../components/SiteHead';
import ServicePageHeader from '../components/ServicePageHeader';
import PricingSection from '../components/PricingSection';
import TechnologyLogos from '../components/TechnologyLogos';
import ServiceSectionGrid from '../components/ServiceSectionGrid';

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = process.env.REACT_APP_API_URL || '/api';
        const res = await fetch(`${API_BASE}/services/${slug}`);
        if (res.status === 404) {
          setService(null);
        } else if (!res.ok) {
          throw new Error('Failed to fetch service');
        } else {
          const data = await res.json();
          setService(data);
          
          // Track Meta Pixel ViewContent event for service view
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'ViewContent', {
              content_type: 'service',
              content_name: data.title || data.name,
              content_category: 'Services'
            });
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching service');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchService();
  }, [slug]);

  if (loading) return <div className="text-center py-16">Loading service...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!service) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service not found</h1>
          <p className="text-gray-600 dark:text-gray-400">Please check the URL or go back to the services page.</p>
        </div>
      </div>
    );
  }

  // Determine layout based on content shape. If any section has an image, use the detailed view.
  const useGridView = service.sections && Array.isArray(service.sections) && service.sections.every((section: any) => !section.image);

  return (
    <>
      <SiteHead 
        title={service.title || service.name}
        description={service.excerpt || `Professional ${service.title || service.name} services by ClickBit. Custom solutions tailored to your business needs.`}
        image={service.headerImage || service.featured_image}
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-gray-50 dark:bg-gray-900"
      >
      <ServicePageHeader title={service.title || service.name} image={service.headerImage} slug={service.slug} />
      <PricingSection pricing={{ ...service.pricing, serviceSlug: service.slug }} />
      <ServiceSectionGrid sections={service.sections || []} />
      <TechnologyLogos serviceSlug={service.slug} />
      </motion.div>
    </>
  );
};

export default ServiceDetailPage; 