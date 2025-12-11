import React, { useState, useMemo, Fragment, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { projectFormData, ServiceOption, Feature, FeatureCategory } from '../services/POWER_YOUR_PROJECT_DATA';
import { Check, ArrowRight, ArrowLeft, Send, AlertCircle, Code, Server, BrainCircuit, Building2, Palette, BarChart2, Award } from 'lucide-react';
import api from '../services/api';
// import { services as allCategories } from '../services/serviceData';
// TODO: Replace static data with API call to backend for services
const allCategories: Record<string, any> = {};

// Define interfaces
interface ServiceFromBackend {
    id: string;
    name: string;
    description: string;
    category: string;
    featureCategories: {
        id: string;
        name: string;
        features: Feature[];
    }[];
}

type FormData = {
    clientName: string;
    primaryContact: string;
    email: string;
    contactNumber: string;
    companyName: string;
    companyAddress: string;
    industry: string;
    projectName: string;
    projectDescription: string;
    businessObjectives: string;
    targetAudience: string;
    budget: string;
    startDate: string;
    endDate: string;
    milestones: string;
    clientBackground: string;
    stakeholders: string;
    initialGoals: string;
    projectConstraints: string;
    futureExpansion: string;
    selectedServices: { [key: string]: ServiceOption };
    selectedFeatures: { [key: string]: { [key: string]: Feature } };
    signature: string;
    agreed: boolean;
};

type FormErrors = {
    [key: string]: string;
};

const STEPS = [
    { id: 1, name: "Client Info" },
    { id: 2, name: "Project Details" },
    { id: 3, name: "Category" },
    { id: 4, name: "Services" },
    { id: 5, name: "Features" },
    { id: 6, name: "Review" },
];

export const serviceCategories: { id: string; name: string; icon: React.ElementType }[] = [
    { id: 'development', name: 'Development', icon: Code },
    { id: 'infrastructure', name: 'Infrastructure', icon: Server },
    { id: 'specialized-tech', name: 'Specialized Tech', icon: BrainCircuit },
    { id: 'business-systems', name: 'Business Systems', icon: Building2 },
    { id: 'design', name: 'Design & Branding', icon: Palette },
    { id: 'marketing', name: 'Marketing & Growth', icon: BarChart2 },
    { id: 'packages', name: 'Business Packages', icon: Award },
];

const Step5Features = ({ formData, selectedServices, selectedFeatures, toggleFeature }: { formData: FormData, selectedServices: any, selectedFeatures: any, toggleFeature: (serviceId: string, feature: Feature) => void }) => {
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Features for Selected Services</h2>
            <div className="space-y-6">
                {Object.entries(selectedServices).map(([serviceId, service]) => {
                    const typedService = service as ServiceOption;
                    return (
                        <div key={serviceId}>
                            <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">{typedService.name}</h3>
                            {typedService.featureCategories && typedService.featureCategories.map((category: FeatureCategory) => (
                                <div key={category.id} className="mb-4">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{category.name}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {category.features.map((feature: Feature) => (
                                            <div key={feature.id} onClick={() => toggleFeature(serviceId, feature)}
                                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${(selectedFeatures[serviceId] && selectedFeatures[serviceId][feature.id]) ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'}`}>
                                                <div className="flex items-center">
                                                    <span className="font-bold text-lg">{feature.name}</span>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Step6Review = ({ formData, totalCost, handleInputChange, errors }: { formData: FormData, totalCost: number, handleInputChange: any, errors: FormErrors }) => {
    const budget = formData.budget ? Number(formData.budget) : 0;
    const isBudgetLower = budget > 0 && budget < totalCost;
    
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 6: Review & Submit</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Please review all the details below. If everything is correct, you can submit your project request.</p>
            
            {isBudgetLower && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <div>
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Budget Alert</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Your budget (${budget.toLocaleString()}) is lower than the estimated cost (${totalCost.toLocaleString()}). 
                                We'll work with you to find the best solution within your budget.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Client & Project Details</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Client:</span> {formData.clientName}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Contact:</span> {formData.primaryContact}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span> {formData.email}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Contact Number:</span> {formData.contactNumber || 'N/A'}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Company:</span> {formData.companyName || 'N/A'}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Industry:</span> {formData.industry || 'N/A'}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Project Name:</span> {formData.projectName}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Budget:</span> {formData.budget ? `$${Number(formData.budget).toLocaleString()}` : 'N/A'}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">Start Date:</span> {formData.startDate || 'N/A'}</p>
                        <p><span className="font-semibold text-gray-600 dark:text-gray-400">End Date:</span> {formData.endDate || 'N/A'}</p>
                    </div>
                </div>

                {formData.projectDescription && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Project Description</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.projectDescription}</p>
                    </div>
                )}

                {formData.businessObjectives && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Business Objectives</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.businessObjectives}</p>
                    </div>
                )}

                {formData.targetAudience && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Target Audience</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.targetAudience}</p>
                    </div>
                )}

                {formData.milestones && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Key Milestones</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.milestones}</p>
                    </div>
                )}

                {formData.clientBackground && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Client Background</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.clientBackground}</p>
                    </div>
                )}

                {formData.stakeholders && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Key Stakeholders</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.stakeholders}</p>
                    </div>
                )}

                {formData.initialGoals && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Initial Project Goals</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.initialGoals}</p>
                    </div>
                )}

                {formData.projectConstraints && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Project Constraints</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.projectConstraints}</p>
                    </div>
                )}

                {formData.futureExpansion && (
                    <div>
                        <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Future Expansion Plans</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formData.futureExpansion}</p>
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-lg text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Selected Services & Features</h3>
                    <div className="space-y-4">
                        {Object.values(formData.selectedServices).map(service => (
                            <div key={service.id}>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{service.name}</h4>
                                <ul className="list-disc list-inside ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {Object.values(formData.selectedFeatures[service.id] || {}).length > 0 ? 
                                        Object.values(formData.selectedFeatures[service.id] || {}).map(feature => (
                                            <li key={feature.id} className="flex justify-between">
                                                <span>{feature.name}</span>
                                                <span className="font-mono">+${(feature.price || 0).toLocaleString()}</span>
                                            </li>
                                        ))
                                    : <li>No specific features selected.</li>}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-300 dark:border-gray-600 mt-6">
                     <div className="flex justify-between items-center text-xl font-bold">
                        <span className="text-gray-900 dark:text-white">Final Estimated Total:</span>
                        <span className="text-primary">${totalCost.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This is just an estimate. Final price will be determined after discussion.</p>
                </div>
                <div className="pt-4 border-t border-gray-300 dark:border-gray-600 mt-6">
                    <h3 className="font-bold text-lg text-primary mb-2">Terms & Conditions</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 mb-4 max-h-40 overflow-y-auto">
                        By submitting this form, you agree to ClickBit's terms and conditions. All information provided is accurate to the best of your knowledge. The estimate provided is not a binding quote and is subject to change after further discussion and project scoping. We will work with you to ensure the final solution meets your needs and budget requirements.
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="agreed" type="checkbox" checked={formData.agreed} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="agreed" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">I agree to the terms and conditions above.</label>
                    </div>
                    <div>
                        <label htmlFor="signature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signature (type your full name)</label>
                        <input id="signature" type="text" value={formData.signature} onChange={handleInputChange} className="input w-full rounded-full px-5 py-3 text-base border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary transition-colors duration-200 bg-white dark:bg-gray-900" placeholder="Your full name" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Step3 = ({ selectedCategories, toggleCategory, errors }: { selectedCategories: string[], toggleCategory: (id: string) => void, errors: FormErrors }) => (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Select Service Categories</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base">You can select multiple categories that apply to your project needs.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
            {serviceCategories.map((cat: { id: string; name: string; icon: React.ElementType }) => {
                const isSelected = selectedCategories.includes(cat.id);
                const Icon = cat.icon;
                return (
                    <div key={cat.id} onClick={() => toggleCategory(cat.id)}
                        className={`p-4 lg:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative min-h-[80px] lg:min-h-auto ${isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'}`}>
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`} />
                            </div>
                            <span className="ml-3 lg:ml-4 font-bold text-sm lg:text-lg">{cat.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
        {errors.selectedCategories && (
            <div className="mt-4 text-sm text-red-600">
                {errors.selectedCategories}
            </div>
        )}
    </div>
);

const Step4 = ({ selectedCategories, selectedServices, toggleService, errors, servicesFromBackend }: { 
    selectedCategories: string[], 
    selectedServices: any, 
    toggleService: (id: string) => void, 
    errors: FormErrors,
    servicesFromBackend: { [key: string]: ServiceFromBackend }
}) => {
    if (selectedCategories.length === 0) return <div className="text-center text-gray-500">Please select at least one category first.</div>;
    
    // Filter services by selected categories
    const allServices = Object.values(servicesFromBackend).filter(service => {
        const categoryMap: { [key: string]: string } = {
            'development': 'Development',
            'infrastructure': 'Infrastructure',
            'specialized-tech': 'Specialized Tech',
            'business-systems': 'Business Systems',
            'design': 'Design & Branding',
            'marketing': 'Marketing & Growth',
            'packages': 'Business Packages'
        };
        
        return selectedCategories.some(catId => categoryMap[catId] === service.category);
    });

    if (allServices.length === 0) return <div className="text-center text-gray-500">No services found for the selected categories.</div>;
    
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Services</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Choose the services you need from the selected categories.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map(service => {
                    const isSelected = !!selectedServices[service.id];
                    return (
                        <div key={service.id} onClick={() => toggleService(service.id)}
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'}`}>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg mb-2">{service.name}</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {errors.selectedServices && (
                <div className="mt-4 text-sm text-red-600">
                    {errors.selectedServices}
                </div>
            )}
        </div>
    );
};

const PowerYourProjectPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
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
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [servicesFromBackend, setServicesFromBackend] = useState<{ [key: string]: ServiceFromBackend }>({});
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState<string | null>(null);

    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'clientName':
                return value.trim() ? '' : 'Company name is required';
            case 'primaryContact':
                return value.trim() ? '' : 'Primary contact is required';
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !value.trim() ? 'Email is required' : !emailRegex.test(value) ? 'Please enter a valid email address' : '';
            case 'contactNumber':
                const phoneRegex = /^(\+\d{1,4}[\s-]?)?(0\d{8,10}|[1-9]\d{7,14})$/;
                const cleaned = String(value).replace(/[\s\-()]/g, '');
                return !value.trim() ? 'Contact number is required' : !phoneRegex.test(cleaned) ? 'Please enter a valid contact number' : '';
            case 'budget':
                if (value && Number(value) < 0) return 'Budget cannot be negative';
                return '';
            case 'startDate':
                if (value) {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const start = new Date(value);
                    if (start < today) return 'Start date cannot be in the past';
                }
                return '';
            case 'endDate':
                if (value && formData.startDate) {
                    const start = new Date(formData.startDate);
                    const end = new Date(value);
                    if (end < start) return 'Completion date cannot be before start date';
                }
                return '';
            case 'projectName':
                return value.trim() ? '' : 'Project name is required';
            case 'projectDescription':
                return value.trim() ? '' : 'Project description is required';
            default:
                return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const { id, value } = target;
        let error = '';

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ ...prev, [id]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
            error = validateField(id, value);
        }
        
        setErrors(prev => ({ ...prev, [id]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const error = validateField(id, value);
        setErrors(prev => ({ ...prev, [id]: error }));
    };

    const setDate = (key: 'startDate' | 'endDate', date: string) => {
        setFormData(prev => ({...prev, [key]: date}));
        const error = validateField(key, date);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const toggleService = (serviceId: string) => {
        const service = servicesFromBackend[serviceId];
        if (!service) return;

        setFormData(prev => {
            const newSelectedServices = { ...prev.selectedServices };
            const newSelectedFeatures = { ...prev.selectedFeatures };

            if (newSelectedServices[serviceId]) {
                delete newSelectedServices[serviceId];
                delete newSelectedFeatures[serviceId];
            } else {
                // Convert backend service to ServiceOption format
                const serviceOption: ServiceOption = {
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    category: service.category,
                    icon: Code, // Default icon
                    featureCategories: service.featureCategories
                };
                newSelectedServices[serviceId] = serviceOption;
                newSelectedFeatures[serviceId] = {};
            }

            return { ...prev, selectedServices: newSelectedServices, selectedFeatures: newSelectedFeatures };
        });
    };

    const toggleFeature = (serviceId: string, feature: Feature) => {
        setFormData(prev => {
            const newSelectedFeatures = JSON.parse(JSON.stringify(prev.selectedFeatures));
            const serviceFeatures = newSelectedFeatures[serviceId] || {};

            if (serviceFeatures[feature.id]) {
                delete serviceFeatures[feature.id];
            } else {
                serviceFeatures[feature.id] = feature;
            }

            newSelectedFeatures[serviceId] = serviceFeatures;
            return { ...prev, selectedFeatures: newSelectedFeatures };
        });
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const totalCost = useMemo(() => {
        return Object.values(formData.selectedFeatures).reduce((acc, serviceFeatures) => {
            return acc + Object.values(serviceFeatures).reduce((sAcc, feature) => sAcc + (feature.price || 0), 0);
        }, 0);
    }, [formData.selectedFeatures]);

    const nextStep = () => {
        if (currentStep === 1) {
            // Step 1: Client Information validation
            const requiredFields = ['clientName', 'primaryContact', 'email'];
            const newErrors: FormErrors = {};
            requiredFields.forEach(field => {
                const error = validateField(field, formData[field as keyof FormData] as string);
                if (error) newErrors[field] = error;
            });
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        } else if (currentStep === 2) {
            // Step 2: Project Details validation
            const requiredFields = ['projectName', 'projectDescription'];
            const newErrors: FormErrors = {};
            requiredFields.forEach(field => {
                const error = validateField(field, formData[field as keyof FormData] as string);
                if (error) newErrors[field] = error;
            });
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        } else if (currentStep === 3) {
            // Step 3: Category selection validation
            if (selectedCategories.length === 0) {
                setErrors(prev => ({ ...prev, selectedCategories: 'Please select at least one category.' }));
                return;
            }
        } else if (currentStep === 4) {
            // Step 4: Service selection validation
            if (Object.keys(formData.selectedServices).length === 0) {
                setErrors(prev => ({ ...prev, selectedServices: 'Please select at least one service.' }));
                return;
            }
        } else if (currentStep === 6) {
            // Step 6: Review & Submit validation
            if (!formData.agreed || !formData.signature.trim()) {
                setErrors(prev => ({ ...prev, agreed: !formData.agreed ? 'You must agree to the terms.' : '', signature: !formData.signature.trim() ? 'Signature required.' : '' }));
                return;
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    };
    
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const canGoNext = () => {
        if (currentStep === 1) {
            return formData.clientName.trim() && formData.primaryContact.trim() && formData.email.trim();
        } else if (currentStep === 2) {
            return formData.projectName.trim() && formData.projectDescription.trim();
        } else if (currentStep === 3) {
            return selectedCategories.length > 0;
        } else if (currentStep === 4) {
            return Object.keys(formData.selectedServices).length > 0;
        } else if (currentStep === 5) {
            return true; // Features step
        } else if (currentStep === 6) {
            return formData.agreed && formData.signature.trim();
        }
        return false;
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <Step1 formData={formData} handleInputChange={handleInputChange} handleBlur={handleBlur} errors={errors} setDate={setDate} />;
            case 2:
                return <Step2 formData={formData} handleInputChange={handleInputChange} handleBlur={handleBlur} errors={errors} setDate={setDate} />;
            case 3:
                return <Step3 selectedCategories={selectedCategories} toggleCategory={toggleCategory} errors={errors} />;
            case 4:
                if (servicesLoading) {
                    return (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    );
                }
                if (servicesError) {
                    return (
                        <div className="text-center py-10">
                            <p className="text-red-600 mb-4">{servicesError}</p>
                            <button onClick={() => window.location.reload()} className="btn-primary">
                                Reload Page
                            </button>
                        </div>
                    );
                }
                return <Step4 selectedCategories={selectedCategories} selectedServices={formData.selectedServices} toggleService={toggleService} errors={errors} servicesFromBackend={servicesFromBackend} />;
            case 5:
                return <Step5Features formData={formData} selectedServices={formData.selectedServices} selectedFeatures={formData.selectedFeatures} toggleFeature={toggleFeature} />;
            case 6:
                return <Step6Review formData={formData} totalCost={totalCost} handleInputChange={handleInputChange} errors={errors} />;
            default:
                return null;
        }
    };

    const handleStepClick = (stepId: number) => {
        // Only allow going back or to completed steps, or forward if all required fields are valid
        if (stepId < currentStep) {
            setCurrentStep(stepId);
        } else if (stepId > currentStep) {
            // Validate all steps up to the clicked step
            let valid = true;
            for (let i = currentStep; i < stepId; i++) {
                if (!canGoNext()) {
                    valid = false;
                    break;
                }
            }
            if (valid) setCurrentStep(stepId);
        }
    };

    const handleSubmit = async () => {
        // Final validation
        if (!formData.agreed || !formData.signature.trim()) {
            setErrors(prev => ({ 
                ...prev, 
                agreed: !formData.agreed ? 'You must agree to the terms.' : '', 
                signature: !formData.signature.trim() ? 'Signature required.' : '' 
            }));
            return;
        }

        setLoading(true);
        setSubmitError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'project',
                    ...formData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit project details');
            }

            setSubmitSuccess(true);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit project details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch services from backend
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setServicesLoading(true);
                const response = await api.get('/services/for-project-form');
                setServicesFromBackend(response.data);
                setServicesError(null);
            } catch (error) {
                console.error('Error fetching services:', error);
                setServicesError('Failed to load services. Please try again later.');
            } finally {
                setServicesLoading(false);
            }
        };
        
        fetchServices();
    }, []);

    return (
        <>
            <PageHeader
                title="Power Your Project"
                breadcrumbs={[
                    { name: 'Home', href: '/' },
                    { name: 'Get Started', href: '/get-started' },
                ]}
            />
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="text-center mb-8 lg:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">Build Your Estimate</h1>
                    <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">Follow the steps to select the services and features you need. Our tool will provide a real-time cost estimate for your project.</p>
                </div>

                {/* Mobile-optimized stepper */}
                <div className="mb-8 lg:mb-12">
                    {/* Desktop stepper */}
                    <div className="hidden lg:flex justify-center items-center">
                        {STEPS.map((step, index) => (
                            <Fragment key={step.id}>
                                <div
                                    className={`flex items-center cursor-pointer ${currentStep >= step.id ? 'text-primary' : 'text-gray-500'}`}
                                    onClick={() => handleStepClick(step.id)}
                                >
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-300 mr-3 ${
                                            currentStep === step.id
                                                ? 'bg-primary text-white ring-2 ring-primary/50'
                                                : currentStep > step.id
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        {currentStep > step.id ? <Check size={16} /> : step.id}
                                    </div>
                                    <span className="font-semibold">{step.name}</span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                )}
                            </Fragment>
                        ))}
                    </div>

                    {/* Mobile stepper */}
                    <div className="lg:hidden">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Step {currentStep} of {STEPS.length}
                            </span>
                            <span className="text-sm font-medium text-primary">
                                {Math.round((currentStep / STEPS.length) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {STEPS[currentStep - 1].name}
                            </h3>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-3"
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>
                    {currentStep < STEPS.length ? (
                         <button
                            onClick={nextStep}
                            disabled={!canGoNext()}
                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-3"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button 
                            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center px-6 py-3" 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Project <Send size={16} />
                                </>
                            )}
                        </button>
                    )}
                </div>

                {submitError && (
                    <div className="max-w-4xl mx-auto mt-4">
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                            {submitError}
                        </div>
                    </div>
                )}

                {submitSuccess && (
                    <div className="max-w-4xl mx-auto mt-4">
                        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                            <h3 className="text-lg font-medium">Project submitted successfully!</h3>
                            <p className="mt-2">Thank you! We've received your project details and will be in touch shortly.</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const Step1 = ({ formData, handleInputChange, handleBlur, errors, setDate }: { formData: any, handleInputChange: any, handleBlur: any, errors: FormErrors, setDate: (key: 'startDate' | 'endDate', date: string) => void }) => (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Step 1: Client Information</h2>
        <div className="space-y-6 lg:space-y-8">
            <div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 lg:mb-6">Client Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Name <span className="text-red-500">*</span></label>
                        <input id="clientName" type="text" value={formData.clientName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Enter your company name" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.clientName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} required />
                        {errors.clientName && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.clientName}</div>)}
                    </div>
                    <div>
                        <label htmlFor="primaryContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Contact <span className="text-red-500">*</span></label>
                        <input id="primaryContact" type="text" value={formData.primaryContact} onChange={handleInputChange} onBlur={handleBlur} placeholder="Your full name" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.primaryContact ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} required />
                        {errors.primaryContact && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.primaryContact}</div>)}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input id="email" type="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} placeholder="your.email@company.com" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} required />
                        {errors.email && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.email}</div>)}
                    </div>
                    <div>
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number <span className="text-red-500">*</span></label>
                        <input id="contactNumber" type="tel" value={formData.contactNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="+1 (555) 123-4567" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.contactNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400`} required />
                        {errors.contactNumber && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.contactNumber}</div>)}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 lg:mb-6">Organizational Context</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company/Organization</label>
                        <input id="companyName" type="text" value={formData.companyName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Your company name" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} />
                        {errors.companyName && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.companyName}</div>)}
                    </div>
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry/Sector</label>
                        <input id="industry" type="text" value={formData.industry} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., Technology, Healthcare, Retail" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.industry ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} />
                        {errors.industry && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.industry}</div>)}
                    </div>
                    <div className="lg:col-span-2">
                        <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Address (Optional)</label>
                        <input id="companyAddress" type="text" value={formData.companyAddress} onChange={handleInputChange} onBlur={handleBlur} placeholder="Your business address" className={`input w-full rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base border transition-colors duration-200 ${errors.companyAddress ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} />
                        {errors.companyAddress && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.companyAddress}</div>)}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Step2 = ({ formData, handleInputChange, handleBlur, errors, setDate }: { formData: any, handleInputChange: any, handleBlur: any, errors: FormErrors, setDate: (key: 'startDate' | 'endDate', date: string) => void }) => (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 2: Project Details</h2>
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Project Details</h3>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name <span className="text-red-500">*</span></label>
                        <input id="projectName" type="text" value={formData.projectName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Enter your project name" className={`input w-full rounded-full px-5 py-3 text-base border transition-colors duration-200 ${errors.projectName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} required />
                        {errors.projectName && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.projectName}</div>)}
                    </div>
                    <div>
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Description <span className="text-red-500">*</span></label>
                        <textarea id="projectDescription" value={formData.projectDescription} onChange={handleInputChange} onBlur={handleBlur} placeholder="Briefly describe your project goals, scope, and what you aim to achieve..." className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.projectDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={4} required />
                        {errors.projectDescription && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.projectDescription}</div>)}
                    </div>
                    <div>
                        <label htmlFor="businessObjectives" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Objectives</label>
                        <textarea id="businessObjectives" value={formData.businessObjectives} onChange={handleInputChange} onBlur={handleBlur} placeholder="What specific business goals will this project help achieve? (e.g., increase revenue, improve efficiency, expand market reach)" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.businessObjectives ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.businessObjectives && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.businessObjectives}</div>)}
                    </div>
                    <div>
                        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
                        <textarea id="targetAudience" value={formData.targetAudience} onChange={handleInputChange} onBlur={handleBlur} placeholder="Who is your target audience? Describe their demographics, needs, and behaviors." className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.targetAudience ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.targetAudience && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.targetAudience}</div>)}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Project Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Start Date</label>
                        <input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setDate('startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={`input w-full rounded-full px-5 py-3 text-base border transition-colors duration-200 ${errors.startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                        />
                        {errors.startDate && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.startDate}</div>)}
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Completion Date</label>
                        <input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setDate('endDate', e.target.value)}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            className={`input w-full rounded-full px-5 py-3 text-base border transition-colors duration-200 ${errors.endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                        />
                        {errors.endDate && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.endDate}</div>)}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="milestones" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Milestones (Optional)</label>
                        <textarea id="milestones" value={formData.milestones} onChange={handleInputChange} onBlur={handleBlur} placeholder="List any important milestones or phases in your project timeline" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.milestones ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.milestones && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.milestones}</div>)}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Budget & Additional Information</h3>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Budget (optional, in AUD)</label>
                        <input id="budget" type="number" min="0" step="any" value={formData.budget} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g. 10000" className={`input w-full rounded-full px-5 py-3 text-base border transition-colors duration-200 ${errors.budget ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} />
                        {errors.budget && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.budget}</div>)}
                    </div>
                    <div>
                        <label htmlFor="clientBackground" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Background/History (Optional)</label>
                        <textarea id="clientBackground" value={formData.clientBackground} onChange={handleInputChange} onBlur={handleBlur} placeholder="Tell us about your company's background, mission, or any relevant history" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.clientBackground ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.clientBackground && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.clientBackground}</div>)}
                    </div>
                    <div>
                        <label htmlFor="stakeholders" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Stakeholders (Beyond Contact Person)</label>
                        <textarea id="stakeholders" value={formData.stakeholders} onChange={handleInputChange} onBlur={handleBlur} placeholder="List other important decision-makers or team members involved in this project" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.stakeholders ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.stakeholders && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.stakeholders}</div>)}
                    </div>
                    <div>
                        <label htmlFor="initialGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Project Goals/Objectives</label>
                        <textarea id="initialGoals" value={formData.initialGoals} onChange={handleInputChange} onBlur={handleBlur} placeholder="What are your primary goals and desired outcomes for this project?" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.initialGoals ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.initialGoals && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.initialGoals}</div>)}
                    </div>
                    <div>
                        <label htmlFor="projectConstraints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Constraints (Optional)</label>
                        <textarea id="projectConstraints" value={formData.projectConstraints} onChange={handleInputChange} onBlur={handleBlur} placeholder="Any limitations, deadlines, or constraints we should be aware of?" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.projectConstraints ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.projectConstraints && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.projectConstraints}</div>)}
                    </div>
                    <div>
                        <label htmlFor="futureExpansion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Future Expansion Plans (Optional)</label>
                        <textarea id="futureExpansion" value={formData.futureExpansion} onChange={handleInputChange} onBlur={handleBlur} placeholder="Any plans for future growth or scalability considerations?" className={`textarea w-full rounded-3xl px-5 py-3 text-base border transition-colors duration-200 ${errors.futureExpansion ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'} bg-white dark:bg-gray-900`} rows={3} />
                        {errors.futureExpansion && (<div className="flex items-center mt-1 text-sm text-red-600"><AlertCircle size={14} className="mr-1" />{errors.futureExpansion}</div>)}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default PowerYourProjectPage;