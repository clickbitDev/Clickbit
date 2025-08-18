import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import ContactForm from '../components/ContactForm';
import Testimonials from '../components/Testimonials';
import AddReview from '../components/AddReview';
import { useContent } from '../contexts/ContentContext';
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin, Clock, Github } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import XIcon from '../components/XIcon';

const ContactPage: React.FC = () => {
  const { contactInfo } = useContent();

  // Map social platform names to icons
  const socialIconMap: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: XIcon,
    tiktok: SiTiktok,
    youtube: Youtube,
    github: Github,
  };

  const getSocialIcon = (platform: string) => {
    const key = platform.toLowerCase();
    return socialIconMap[key] || Facebook; // Default to Facebook icon
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="bg-white dark:bg-gray-900">
        <PageHeader
          title="Contact Us"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Contact Us', href: '/contact' },
          ]}
        />
        
        {/* Main Contact Section */}
        <div className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-[#1FBBD2] font-semibold text-sm uppercase tracking-wider">/ get in touch /</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white my-6 leading-tight">
                Ready to start your project?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Let's discuss your ideas and turn them into reality. Get in touch with our team of experts who are ready to help you succeed.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Contact Form - Takes up 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10">
                  <ContactForm />
                </div>
              </div>

              {/* Contact Information - Takes up 1 column */}
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-gradient-to-br from-[#1FBBD2] to-[#17a2b8] rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                  <div className="space-y-6">
                    {(contactInfo.phone1 || contactInfo.phone2) && (
                      <div className="flex items-start space-x-4">
                        <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Call Us</p>
                          {contactInfo.phone1 && (
                            <a href={`tel:${contactInfo.phone1.replace(/\s/g, '')}`} className="text-white/90 hover:text-white transition-colors block">
                              {contactInfo.phone1}
                            </a>
                          )}
                          {contactInfo.phone2 && (
                            <a href={`tel:${contactInfo.phone2.replace(/\s/g, '')}`} className="text-white/90 hover:text-white transition-colors block">
                              {contactInfo.phone2}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {contactInfo.email && (
                      <div className="flex items-start space-x-4">
                        <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Email Us</p>
                          <a href={`mailto:${contactInfo.email}`} className="text-white/90 hover:text-white transition-colors">
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {contactInfo.address && (
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Visit Us</p>
                          <p className="text-white/90 whitespace-pre-line">
                            {contactInfo.address}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {contactInfo.businessHours && (
                      <div className="flex items-start space-x-4">
                        <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Business Hours</p>
                          <p className="text-white/90 whitespace-pre-line">
                            {contactInfo.businessHours}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Social Links */}
                  {contactInfo.socialLinks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <p className="font-semibold mb-4">Follow Us</p>
                      {/* Debug: Show count of social links */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-white/70 mb-2 text-center">
                          Social Links: {contactInfo.socialLinks.length} platforms
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {contactInfo.socialLinks.map((social, index) => {
                          const IconComponent = getSocialIcon(social.platform);
                          return (
                            <a 
                              key={index}
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors hover:scale-110 transform"
                              aria-label={social.platform}
                              title={social.platform}
                            >
                              <IconComponent size={20} />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Testimonials />
        <AddReview />

        {/* Map Section - Improved styling */}
        <div className="w-full h-[400px] lg:h-[500px] bg-gray-300 relative overflow-hidden">
          <iframe
            src={contactInfo.googleMapsUrl || "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s44+Shoreline+Rd,Moorebank+NSW+2170,Australia!6i15"}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="ClickBit Location"
            className="grayscale hover:grayscale-0 transition-all duration-300"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          {/* Overlay with contact info */}
          {contactInfo.address && (
            <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">ClickBit Office</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {contactInfo.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;