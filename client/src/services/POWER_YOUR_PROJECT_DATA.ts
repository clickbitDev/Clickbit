import React from 'react';

// Types and interfaces for Power Your Project page
export interface Feature {
    id: string;
    name: string;
    description: string;
    price?: number;
}

export interface FeatureCategory {
    id: string;
    name: string;
    features: Feature[];
}

export interface ServiceOption {
    id: string;
    name: string;
    description: string;
    category: string;
    basePrice?: number;
    featureCategories?: FeatureCategory[];
    icon?: React.ElementType;
}

// Initial form data structure
export const projectFormData = {
    clientName: '',
    primaryContact: '',
    email: '',
    contactNumber: '',
    companyName: '',
    companyAddress: '',
    industry: '',
    projectName: '',
    projectDescription: '',
    businessObjectives: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: '',
    milestones: '',
    clientBackground: '',
    stakeholders: '',
    initialGoals: '',
    projectConstraints: '',
    futureExpansion: '',
    selectedServices: {},
    selectedFeatures: {},
    signature: '',
    agreed: false,
};

// Sample service options (can be populated from backend)
export const sampleServiceOptions: ServiceOption[] = [
    {
        id: 'web-development',
        name: 'Web Development',
        description: 'Custom web application development',
        category: 'development',
        basePrice: 5000,
        featureCategories: [
            {
                id: 'frontend',
                name: 'Frontend Features',
                features: [
                    {
                        id: 'responsive-design',
                        name: 'Responsive Design',
                        description: 'Mobile-friendly responsive design',
                        price: 1000
                    },
                    {
                        id: 'custom-ui',
                        name: 'Custom UI Components',
                        description: 'Custom designed UI components',
                        price: 1500
                    }
                ]
            },
            {
                id: 'backend',
                name: 'Backend Features',
                features: [
                    {
                        id: 'api-development',
                        name: 'API Development',
                        description: 'RESTful API development',
                        price: 2000
                    },
                    {
                        id: 'database-integration',
                        name: 'Database Integration',
                        description: 'Database design and integration',
                        price: 1500
                    }
                ]
            }
        ]
    }
]; 