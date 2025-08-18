import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Save, Plus, Trash2, Edit2, DollarSign, Package, Image as ImageIcon } from 'lucide-react';

interface ServiceTier {
  name: string;
  subtitle: string;
  price: string;
  priceSuffix: string;
  features: string[];
  cta: string;
  ctaHref: string;
  isPopular?: boolean;
}

interface ServiceDetail {
  slug: string;
  title: string;
  headerImage: string;
  pricing: {
    superTitle: string;
    title: string;
    tiers: ServiceTier[];
  };
}

const AdminServicesDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<number | null>(null);

  useEffect(() => {
    fetchServiceDetail();
  }, [slug]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/services/${slug}/detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServiceDetail(response.data);
    } catch (err) {
      console.error('Failed to fetch service detail:', err);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const saveServiceDetail = async () => {
    if (!serviceDetail) return;
    
    try {
      setSaving(true);
      await api.put(`/admin/services/${slug}/detail`, serviceDetail, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError(null);
      setEditingTier(null);
    } catch (err) {
      setError('Failed to save service details');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const addNewTier = () => {
    if (!serviceDetail) return;
    
    const newTier: ServiceTier = {
      name: 'New Tier',
      subtitle: 'Description for new tier',
      price: '$99',
      priceSuffix: '/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      cta: 'Get started',
      ctaHref: '/contact'
    };
    
    setServiceDetail({
      ...serviceDetail,
      pricing: {
        ...serviceDetail.pricing,
        tiers: [...serviceDetail.pricing.tiers, newTier]
      }
    });
  };

  const removeTier = (index: number) => {
    if (!serviceDetail) return;
    
    const newTiers = serviceDetail.pricing.tiers.filter((_, i) => i !== index);
    setServiceDetail({
      ...serviceDetail,
      pricing: {
        ...serviceDetail.pricing,
        tiers: newTiers
      }
    });
  };

  const updateTier = (index: number, updatedTier: ServiceTier) => {
    if (!serviceDetail) return;
    
    const newTiers = serviceDetail.pricing.tiers.map((tier, i) => 
      i === index ? updatedTier : tier
    );
    
    setServiceDetail({
      ...serviceDetail,
      pricing: {
        ...serviceDetail.pricing,
        tiers: newTiers
      }
    });
  };

  const addFeatureToTier = (tierIndex: number) => {
    if (!serviceDetail) return;
    
    const newTiers = serviceDetail.pricing.tiers.map((tier, i) => 
      i === tierIndex 
        ? { ...tier, features: [...tier.features, 'New Feature'] }
        : tier
    );
    
    setServiceDetail({
      ...serviceDetail,
      pricing: {
        ...serviceDetail.pricing,
        tiers: newTiers
      }
    });
  };

  const removeFeatureFromTier = (tierIndex: number, featureIndex: number) => {
    if (!serviceDetail) return;
    
    const newTiers = serviceDetail.pricing.tiers.map((tier, i) => 
      i === tierIndex 
        ? { ...tier, features: tier.features.filter((_, fi) => fi !== featureIndex) }
        : tier
    );
    
    setServiceDetail({
      ...serviceDetail,
      pricing: {
        ...serviceDetail.pricing,
        tiers: newTiers
      }
    });
  };

  const updateFeature = (tierIndex: number, featureIndex: number, newFeature: string) => {
    if (!serviceDetail) return;
    
    const newTiers = serviceDetail.pricing.tiers.map((tier, i) => 
      i === tierIndex 
        ? { 
            ...tier, 
            features: tier.features.map((feature, fi) => 
              fi === featureIndex ? newFeature : feature
            )
          }
        : tier
    );
    
    setServiceDetail({
      ...serviceDetail,
      pricing: {
        ...serviceDetail.pricing,
        tiers: newTiers
      }
    });
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !serviceDetail) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => navigate('/admin/services')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Service Details: {serviceDetail?.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage pricing tiers, features, and detailed information for this service.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin/services')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back to Services
            </button>
            <button
              onClick={saveServiceDetail}
              disabled={saving}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {serviceDetail && (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={serviceDetail.title}
                    onChange={(e) => setServiceDetail({
                      ...serviceDetail,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Header Image URL
                  </label>
                  <input
                    type="url"
                    value={serviceDetail.headerImage}
                    onChange={(e) => setServiceDetail({
                      ...serviceDetail,
                      headerImage: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing Information
                </h2>
                <button
                  onClick={addNewTier}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pricing Super Title
                  </label>
                  <input
                    type="text"
                    value={serviceDetail.pricing.superTitle}
                    onChange={(e) => setServiceDetail({
                      ...serviceDetail,
                      pricing: {
                        ...serviceDetail.pricing,
                        superTitle: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pricing Section Title
                  </label>
                  <input
                    type="text"
                    value={serviceDetail.pricing.title}
                    onChange={(e) => setServiceDetail({
                      ...serviceDetail,
                      pricing: {
                        ...serviceDetail.pricing,
                        title: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="space-y-6">
                {serviceDetail.pricing.tiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Tier {tierIndex + 1}: {tier.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingTier(editingTier === tierIndex ? null : tierIndex)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>{editingTier === tierIndex ? 'Done' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => removeTier(tierIndex)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {editingTier === tierIndex ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Tier Name
                            </label>
                            <input
                              type="text"
                              value={tier.name}
                              onChange={(e) => updateTier(tierIndex, { ...tier, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={tier.subtitle}
                              onChange={(e) => updateTier(tierIndex, { ...tier, subtitle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Price
                            </label>
                            <input
                              type="text"
                              value={tier.price}
                              onChange={(e) => updateTier(tierIndex, { ...tier, price: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Price Suffix
                            </label>
                            <input
                              type="text"
                              value={tier.priceSuffix}
                              onChange={(e) => updateTier(tierIndex, { ...tier, priceSuffix: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={tier.isPopular || false}
                              onChange={(e) => updateTier(tierIndex, { ...tier, isPopular: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Popular Tier</span>
                          </label>
                        </div>

                        {/* Features */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Features
                            </label>
                            <button
                              onClick={() => addFeatureToTier(tierIndex)}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              Add Feature
                            </button>
                          </div>
                          <div className="space-y-2">
                            {tier.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => updateFeature(tierIndex, featureIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                  onClick={() => removeFeatureFromTier(tierIndex, featureIndex)}
                                  className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {tier.price}{tier.priceSuffix}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Features</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {tier.features.length} features
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {tier.isPopular ? 'Popular' : 'Standard'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicesDetailPage;