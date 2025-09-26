import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

interface SiteHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SiteHead: React.FC<SiteHeadProps> = ({ 
  title,
  description,
  image = '/logo.svg',
  url,
  type = 'website'
}) => {
  const location = useLocation();
  const { siteIdentity, marketingIntegrations } = useContent();
  
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const pageTitle = title ? `${title} | ${siteIdentity.siteTitle}` : siteIdentity.siteTitle;
  const metaDescription = description || siteIdentity.metaDescription;
  
  // Ensure image URL is absolute for social media previews
  const getAbsoluteImageUrl = (imageUrl: string) => {
    if (!imageUrl) return `${window.location.origin}/logo.svg`;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // Handle relative URLs
    if (imageUrl.startsWith('/')) {
      return `${window.location.origin}${imageUrl}`;
    }
    // Handle URLs without leading slash
    return `${window.location.origin}/${imageUrl}`;
  };
  
  const absoluteImageUrl = getAbsoluteImageUrl(image);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Favicon */}
      <link rel="icon" href={siteIdentity.faviconUrl} />
      
      {/* Google Search Console Verification */}
      {marketingIntegrations.googleSearchConsoleTag && (
        <meta name="google-site-verification" content={marketingIntegrations.googleSearchConsoleTag} />
      )}
      
      {/* Custom Meta Tags */}
      {marketingIntegrations.customMetaTags && (
        <div dangerouslySetInnerHTML={{ __html: marketingIntegrations.customMetaTags }} />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* Additional SEO */}
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content="index, follow" />
      
      {/* Structured Data for Organization Logo */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ClickBIT",
          "url": "https://clickbit.com.au",
          "logo": "https://clickbit.com.au/images/logos/logo-full.png",
          "description": "Leading web development, digital marketing & IT solutions in Australia",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "AU"
          },
          "sameAs": [
            "https://linkedin.clickbit.com.au",
            "https://x.clickbit.com.au"
          ]
        })}
      </script>
      
      {/* Google Analytics with Consent Mode */}
      {marketingIntegrations.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${marketingIntegrations.googleAnalyticsId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Initialize consent mode (denied by default for GDPR compliance)
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                functionality_storage: 'granted',
                personalization_storage: 'denied',
                security_storage: 'granted',
                wait_for_update: 500
              });
              
              gtag('config', '${marketingIntegrations.googleAnalyticsId}', {
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
              
              // Custom event tracking for key business interactions
              function trackEvent(eventName, parameters = {}) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', eventName, parameters);
                  console.log('GA4 Event Tracked:', eventName, parameters);
                } else {
                  console.warn('GA4 not loaded, event not tracked:', eventName, parameters);
                }
              }
              
              // Make trackEvent globally available
              window.trackEvent = trackEvent;
            `}
          </script>
        </>
      )}
      
      {/* Facebook Pixel */}
      {marketingIntegrations.facebookPixelId && (
        <>
          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${marketingIntegrations.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </script>
          <noscript>
            <img height="1" width="1" style={{display: 'none'}}
              src={`https://www.facebook.com/tr?id=${marketingIntegrations.facebookPixelId}&ev=PageView&noscript=1`} />
          </noscript>
        </>
      )}
      
      {/* Custom Header Scripts */}
      {marketingIntegrations.headerScripts && (
        <div dangerouslySetInnerHTML={{ __html: marketingIntegrations.headerScripts }} />
      )}
    </Helmet>
  );
};

export default SiteHead;