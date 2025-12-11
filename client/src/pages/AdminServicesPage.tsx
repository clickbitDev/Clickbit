import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
// import { services } from '../services/serviceData';
import { Edit, Save, X, Plus, Trash2, DollarSign, List } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { Link } from 'react-router-dom';

interface ServiceFeature {
  id?: number;
  name: string;
  description: string;
}

interface ServicePricing {
  id?: number;
  plan: string;
  price: number;
  currency: string;
  features: string[];
}

export interface ServiceData {
  id?: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  features: ServiceFeature[];
  pricing: ServicePricing[];
  isPopular: boolean;
  isActive: boolean;
  featureCount?: number;
}

const AdminServicesPage: React.FC = () => {
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { token } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');

  // Utility function to safely parse JSON fields
  const parseJsonField = (field: any, fallback: any[] = []): any[] => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field || '[]');
      } catch (err) {
        console.warn('Failed to parse JSON field:', err);
        return fallback;
      }
    }
    return fallback;
  };

  // Transform service data to ensure proper array types
  const transformServiceData = (service: any): ServiceData => ({
    ...service,
    features: parseJsonField(service.features, []),
    pricing: parseJsonField(service.pricing, [])
  });

  // Initialize with current service data
  useEffect(() => {
    const fetchServices = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/admin/services', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Transform data to ensure arrays are properly parsed
        const transformedData = response.data.map(transformServiceData);
        setServiceData(transformedData);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        // Fallback to static data if API fails
        const allServices: ServiceData[] = [];
        
        // TODO: Replace static data with API call to backend for services
        // Object.values(services).forEach(category => {
        //   category.items.forEach(item => {
        //     allServices.push({
        //       name: item.name,
        //       slug: item.href.split('/').pop() || '',
        //       description: item.desc,
        //       category: category.name,
        //       features: [],
        //       pricing: [],
        //       isPopular: item.popular || false,
        //       isActive: true
        //     });
        //   });
        // });
        
        setServiceData(allServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  const handleEdit = (service: ServiceData) => {
    // Transform data to ensure arrays are properly parsed
    const transformedService = transformServiceData(service);
    setEditingService(transformedService);
    setShowForm(true);
  };

  const handleSave = async (service: ServiceData) => {
    try {
      if (service.id) {
        await api.put(`/admin/services/${service.id}`, service, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/admin/services', service, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      
      // Refresh the data from server
      const response = await api.get('/admin/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Transform data to ensure arrays are properly parsed
      const transformedData = response.data.map(transformServiceData);
      setServiceData(transformedData);
      
      setShowForm(false);
      setEditingService(null);
    } catch (err) {
      setError('Failed to save service.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleDelete = async (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Refresh the data from server
        const response = await api.get('/admin/services', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Transform data to ensure arrays are properly parsed
        const transformedData = response.data.map(transformServiceData);
        setServiceData(transformedData);
      } catch (err) {
        setError('Failed to delete service.');
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (serviceId: number, currentStatus: boolean) => {
    try {
      await api.put(`/admin/services/${serviceId}/status`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setServiceData(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !currentStatus }
          : service
      ));
    } catch (err) {
      console.error('Failed to toggle service status:', err);
    }
  };

  const handleTogglePopular = async (serviceId: number, currentPopular: boolean) => {
    try {
      await api.put(`/admin/services/${serviceId}/popular`, 
        { isPopular: !currentPopular },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setServiceData(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, isPopular: !currentPopular }
          : service
      ));
    } catch (err) {
      console.error('Failed to toggle service popular status:', err);
    }
  };

  if (loading) return <div className="p-8">Loading services...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all services, their pricing, and features
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Services</h3>
            <p className="text-3xl font-bold text-blue-600">{serviceData.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active</h3>
            <p className="text-3xl font-bold text-green-600">{serviceData.filter(s => s.isActive).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Popular</h3>
            <p className="text-3xl font-bold text-yellow-600">{serviceData.filter(s => s.isPopular).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
            <p className="text-3xl font-bold text-purple-600">{new Set(serviceData.map(s => s.category)).size}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {serviceData
            .filter(service => activeCategory === 'All' || service.category === activeCategory || (activeCategory === 'Popular' && service.isPopular))
            .map((service) => (
              <div key={service.id} className="relative">
                <ServiceCard
                  service={service}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  hidePopularTag={activeCategory === 'Popular'}
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Link
                    to={`/admin/services/${service.slug}/detail`}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Details
                  </Link>
                  <button
                    onClick={() => service.id && handleToggleStatus(service.id, service.isActive)}
                    disabled={!service.id}
                    className={`inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                      service.isActive
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    }`}
                  >
                    {service.isActive ? 'Off' : 'On'}
                  </button>
                  <button
                    onClick={() => service.id && handleTogglePopular(service.id, service.isPopular)}
                    disabled={!service.id}
                    className={`inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                      service.isPopular
                        ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                        : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                    }`}
                  >
                    {service.isPopular ? '⭐ Pop' : '☆ Pop'}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Add New Service Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setEditingService({
                name: '',
                slug: '',
                description: '',
                category: '',
                features: [],
                pricing: [],
                isPopular: false,
                isActive: true
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Service
          </button>
        </div>

        {/* Edit Form Modal */}
        {showForm && editingService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingService.id ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(editingService);
                }} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={editingService.slug}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          slug: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={editingService.category}
                      onChange={(e) => setEditingService({
                        ...editingService,
                        category: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Development">Development</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Business Systems">Business Systems</option>
                      <option value="Design & Branding">Design & Branding</option>
                      <option value="Marketing & Growth">Marketing & Growth</option>
                      <option value="Specialized Tech">Specialized Tech</option>
                      <option value="Business Packages">Business Packages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService({
                        ...editingService,
                        description: e.target.value
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingService.isPopular}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          isPopular: e.target.checked
                        })}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Popular Service</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingService.isActive}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          isActive: e.target.checked
                        })}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>

                  {/* Features Management */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Features</h3>
                      <button
                        type="button"
                        onClick={() => setEditingService({
                          ...editingService,
                          features: [...editingService.features, { name: '', description: '' }]
                        })}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                      >
                        Add Feature
                      </button>
                    </div>
                    {editingService.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2 mb-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Feature name"
                            value={feature.name}
                            onChange={(e) => {
                              const newFeatures = [...editingService.features];
                              newFeatures[index].name = e.target.value;
                              setEditingService({ ...editingService, features: newFeatures });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-2"
                          />
                          <textarea
                            placeholder="Feature description"
                            value={feature.description}
                            onChange={(e) => {
                              const newFeatures = [...editingService.features];
                              newFeatures[index].description = e.target.value;
                              setEditingService({ ...editingService, features: newFeatures });
                            }}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = editingService.features.filter((_, i) => i !== index);
                            setEditingService({ ...editingService, features: newFeatures });
                          }}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Management */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pricing Plans</h3>
                      <button
                        type="button"
                        onClick={() => setEditingService({
                          ...editingService,
                          pricing: [...editingService.pricing, { plan: '', price: 0, currency: 'AUD', features: [] }]
                        })}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                      >
                        Add Pricing Plan
                      </button>
                    </div>
                    {editingService.pricing.map((pricing, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">Plan {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newPricing = editingService.pricing.filter((_, i) => i !== index);
                              setEditingService({ ...editingService, pricing: newPricing });
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Plan Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Basic, Professional"
                              value={pricing.plan}
                              onChange={(e) => {
                                const newPricing = [...editingService.pricing];
                                newPricing[index].plan = e.target.value;
                                setEditingService({ ...editingService, pricing: newPricing });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Price
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={pricing.price}
                              onChange={(e) => {
                                const newPricing = [...editingService.pricing];
                                newPricing[index].price = parseFloat(e.target.value) || 0;
                                setEditingService({ ...editingService, pricing: newPricing });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Currency
                            </label>
                            <select
                              value={pricing.currency}
                              onChange={(e) => {
                                const newPricing = [...editingService.pricing];
                                newPricing[index].currency = e.target.value;
                                setEditingService({ ...editingService, pricing: newPricing });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="AUD">AUD</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Plan Features (one per line)
                          </label>
                          <textarea
                            placeholder="Enter features, one per line"
                            value={pricing.features.join('\n')}
                            onChange={(e) => {
                              const newPricing = [...editingService.pricing];
                              newPricing[index].features = e.target.value.split('\n').filter(f => f.trim());
                              setEditingService({ ...editingService, pricing: newPricing });
                            }}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicesPage;
