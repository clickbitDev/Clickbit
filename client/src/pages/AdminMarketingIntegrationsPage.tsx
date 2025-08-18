import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface MarketingIntegrations {
  headerScripts: string;
  googleSearchConsoleTag: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  customMetaTags: string;
}

const AdminMarketingIntegrationsPage: React.FC = () => {
  const [marketingIntegrations, setMarketingIntegrations] = useState<MarketingIntegrations>({
    headerScripts: '',
    googleSearchConsoleTag: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    customMetaTags: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMarketingIntegrations();
  }, []);

  const fetchMarketingIntegrations = async () => {
    try {
      const response = await api.get('/admin/marketing-integrations');
      setMarketingIntegrations(response.data);
    } catch (error) {
      console.error('Error fetching marketing integrations:', error);
      toast.error('Failed to load marketing integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/admin/marketing-integrations', { marketingIntegrations });
      toast.success('Marketing integrations updated successfully');
    } catch (error) {
      console.error('Error updating marketing integrations:', error);
      toast.error('Failed to update marketing integrations');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof MarketingIntegrations, value: string) => {
    setMarketingIntegrations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing & Integrations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage SEO, analytics, and marketing tracking codes
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          
          {/* Google Analytics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Analytics Measurement ID
            </label>
            <input
              type="text"
              value={marketingIntegrations.googleAnalyticsId}
              onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your Google Analytics 4 measurement ID (starts with G-)
            </p>
          </div>

          {/* Google Search Console */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Search Console Verification Tag
            </label>
            <input
              type="text"
              value={marketingIntegrations.googleSearchConsoleTag}
              onChange={(e) => handleInputChange('googleSearchConsoleTag', e.target.value)}
              placeholder="Enter verification code only (not the full meta tag)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              The content value from your Google Search Console verification meta tag
            </p>
          </div>

          {/* Facebook Pixel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              value={marketingIntegrations.facebookPixelId}
              onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
              placeholder="123456789012345"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your Facebook Pixel ID for conversion tracking
            </p>
          </div>

          {/* Custom Meta Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Meta Tags
            </label>
            <textarea
              value={marketingIntegrations.customMetaTags}
              onChange={(e) => handleInputChange('customMetaTags', e.target.value)}
              placeholder='<meta name="example" content="value" />'
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Additional meta tags to include in the head section
            </p>
          </div>

          {/* Custom Header Scripts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Header Scripts
            </label>
            <textarea
              value={marketingIntegrations.headerScripts}
              onChange={(e) => handleInputChange('headerScripts', e.target.value)}
              placeholder={`<!-- Example: Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>`}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Custom scripts to inject before the closing &lt;/head&gt; tag (Google Tag Manager, etc.)
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Important Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    Only add scripts from trusted sources. Malicious scripts can compromise your website's security.
                    Always verify the source and purpose of any tracking code before adding it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminMarketingIntegrationsPage;