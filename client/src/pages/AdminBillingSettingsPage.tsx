import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface BillingSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalClientSecret: string;
  currencyCode: string;
  taxRate: number;
  companyAbn: string;
  billingAddress: string;
  paymentTerms: string;
}

const AdminBillingSettingsPage: React.FC = () => {
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    currencyCode: 'AUD',
    taxRate: 10,
    companyAbn: '',
    billingAddress: '',
    paymentTerms: 'Net 30'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchBillingSettings();
  }, []);

  const fetchBillingSettings = async () => {
    try {
      const response = await api.get('/admin/billing-settings');
      setBillingSettings(response.data);
    } catch (error) {
      console.error('Error fetching billing settings:', error);
      toast.error('Failed to load billing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/admin/billing-settings', { billingSettings });
      toast.success('Billing settings updated successfully');
    } catch (error) {
      console.error('Error updating billing settings:', error);
      toast.error('Failed to update billing settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof BillingSettings, value: string | number) => {
    setBillingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleShowSecret = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const maskSecret = (value: string) => {
    if (!value) return '';
    return value.replace(/./g, '•');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure payment gateways and billing information
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

        <div className="space-y-6">
          {/* Stripe Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Stripe Payment Gateway
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stripe Publishable Key
                </label>
                <input
                  type="text"
                  value={billingSettings.stripePublishableKey}
                  onChange={(e) => handleInputChange('stripePublishableKey', e.target.value)}
                  placeholder="pk_live_... or pk_test_..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your Stripe publishable key (safe to expose in frontend code)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stripe Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.stripeSecretKey ? "text" : "password"}
                    value={showSecrets.stripeSecretKey ? billingSettings.stripeSecretKey : maskSecret(billingSettings.stripeSecretKey)}
                    onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                    placeholder="sk_live_... or sk_test_..."
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowSecret('stripeSecretKey')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showSecrets.stripeSecretKey ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your Stripe secret key (keep confidential)
                </p>
              </div>
            </div>
          </div>

          {/* PayPal Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              PayPal Payment Gateway
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PayPal Client ID
                </label>
                <input
                  type="text"
                  value={billingSettings.paypalClientId}
                  onChange={(e) => handleInputChange('paypalClientId', e.target.value)}
                  placeholder="PayPal Client ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PayPal Client Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.paypalClientSecret ? "text" : "password"}
                    value={showSecrets.paypalClientSecret ? billingSettings.paypalClientSecret : maskSecret(billingSettings.paypalClientSecret)}
                    onChange={(e) => handleInputChange('paypalClientSecret', e.target.value)}
                    placeholder="PayPal Client Secret"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowSecret('paypalClientSecret')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showSecrets.paypalClientSecret ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* General Billing Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              General Billing Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency Code
                </label>
                <select
                  value={billingSettings.currencyCode}
                  onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={billingSettings.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company ABN
                </label>
                <input
                  type="text"
                  value={billingSettings.companyAbn}
                  onChange={(e) => handleInputChange('companyAbn', e.target.value)}
                  placeholder="12 345 678 901"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Terms
                </label>
                <select
                  value={billingSettings.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 7">Net 7 Days</option>
                  <option value="Net 14">Net 14 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Billing Address
              </label>
              <textarea
                value={billingSettings.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                placeholder="ClickBit Pty Ltd&#10;44 Shoreline Road&#10;Moorebank NSW 2170&#10;Australia"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Security Warning
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>
                    Keep your API keys and secrets secure. Never share them or expose them in client-side code.
                    Use test keys during development and live keys only in production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminBillingSettingsPage;