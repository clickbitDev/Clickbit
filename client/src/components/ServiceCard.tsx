import React from 'react';
import { Edit, Trash2, List, DollarSign } from 'lucide-react';
import { ServiceData } from '../pages/AdminServicesPage';

interface ServiceCardProps {
  service: ServiceData;
  onEdit: (service: ServiceData) => void;
  onDelete: (id: number) => void;
  hidePopularTag?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete, hidePopularTag }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {service.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{service.category}</span>
            {service.id && (
              <>
                <span>•</span>
                <span>ID: {service.id}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!service.isActive && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Inactive
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {service.description}
      </p>
      {service.features && service.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <List className="h-4 w-4 mr-1" />
            Features ({service.featureCount || service.features.length})
          </h4>
        </div>
      )}
      {service.pricing && service.pricing.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Pricing ({service.pricing.length} plans)
          </h4>
        </div>
      )}
      
      {/* Popular tag at bottom-left and action buttons at bottom-right */}
      <div className="flex justify-between items-center mt-4">
        <div>
          {service.isPopular && !hidePopularTag && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Popular
            </span>
          )}
        </div>
        <div className="flex space-x-1">
        <button
          onClick={() => onEdit(service)}
          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title="Quick edit service"
        >
          <Edit className="h-4 w-4" />
        </button>
        {service.id && (
          <button
            onClick={() => onDelete(service.id!)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Delete service"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;