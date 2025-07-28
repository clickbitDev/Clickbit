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
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content="index, follow" />
      
      {/* Google Analytics */}
      {marketingIntegrations.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${marketingIntegrations.googleAnalyticsId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${marketingIntegrations.googleAnalyticsId}');
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