import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ErrorHandler } from '../utils/errorHandler';

// Extend the AxiosRequestConfig to include our custom properties
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    retryCount?: number;
  }
  
  export interface AxiosError {
    userMessage?: string;
  }
}

// Create axios instance with improved configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000, // Increased to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration
  maxRedirects: 5,
  validateStatus: (status) => status < 500, // Only retry on 5xx errors
});

// Retry logic for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (error: AxiosError, retries = MAX_RETRIES): Promise<any> => {
  if (retries === 0) {
    throw error;
  }

  // Only retry on network errors or 5xx server errors
  const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status < 600);
  
  if (!shouldRetry) {
    throw error;
  }

  console.log(`Request failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
  await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1)); // Exponential backoff

  try {
    return await api.request(error.config!);
  } catch (retryError) {
    return retryRequest(retryError as AxiosError, retries - 1);
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date().getTime() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and add retry logic
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development' && response.config.metadata) {
      const duration = new Date().getTime() - response.config.metadata.startTime;
      console.log(`API call to ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page and not during initial auth check
      if (!window.location.pathname.includes('/login') && !error.config?.url?.includes('/auth/me')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    // Handle specific error codes with redirects
    if (error.response?.status === 403 || error.response?.status === 404 || error.response?.status === 503) {
      ErrorHandler.handleApiError(error.response.status);
      return Promise.reject(error);
    }
    
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
        url: error.config?.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request (No Response):', {
        message: error.message,
        url: error.config?.url,
        timeout: error.code === 'ECONNABORTED',
      });
      
      // Retry the request if it's a network error
      if (error.config && !error.config.retryCount) {
        error.config.retryCount = 0;
      }
      
      if (error.config && error.config.retryCount !== undefined && error.config.retryCount < MAX_RETRIES) {
        error.config.retryCount++;
        return retryRequest(error);
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
    
    // Create a user-friendly error message
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.code === 'ECONNABORTED') {
      userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (!error.response) {
      userMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.response.status >= 500) {
      userMessage = 'Server error. Please try again later.';
    } else if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      userMessage = (error.response.data as any).message;
    }
    
    // Add user-friendly message to error
    error.userMessage = userMessage;
    
    return Promise.reject(error);
  }
);

// Types
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  avatar?: string;
  created_at: string;
}

// Auth API
export const authAPI = {
  login: (data: LoginData) => api.post('/auth/login', data),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: Partial<User>) => api.put('/auth/profile', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  search: (query: string) => api.get('/products/search', { params: { q: query } }),
  getByCategory: (categoryId: number) => api.get(`/products/category/${categoryId}`),
};

// Orders API
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  cancel: (id: number) => api.post(`/orders/${id}/cancel`),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data: any) => api.post('/payments/create-payment-intent', data),
  createPayPalOrder: (data: any) => api.post('/payments/create-paypal-order', data),
  confirmPayment: (data: any) => api.post('/payments/confirm-payment', data),
  getOrder: (id: string) => api.get(`/payments/order/${id}`),
  getPaymentMethods: () => api.get('/payments/methods'),
  addPaymentMethod: (data: any) => api.post('/payments/methods', data),
  removePaymentMethod: (id: string) => api.delete(`/payments/methods/${id}`),
};

// Content API (Legacy - for backward compatibility)
export const contentAPI = {
  getPages: () => api.get('/content/pages'),
  getPage: (slug: string) => api.get(`/content/pages/${slug}`),
  getBlogPosts: (params?: any) => api.get('/blog', { params }),
  getBlogPost: (slug: string) => api.get(`/blog/${slug}`),
};

// Blog API
export const blogAPI = {
  // Public endpoints
  getAll: (params?: any) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  getFeatured: (limit?: number) => api.get('/blog/featured', { params: { limit } }),
  
  // Admin endpoints
  admin: {
    getAll: (params?: any) => api.get('/blog/admin/all', { params }),
    getById: (id: number) => api.get(`/blog/admin/${id}`),
    create: (data: any) => api.post('/blog/admin', data),
    update: (id: number, data: any) => api.put(`/blog/admin/${id}`, data),
    delete: (id: number) => api.delete(`/blog/admin/${id}`),
    getStats: () => api.get('/blog/admin/stats'),
  }
};

// Portfolio API
export const portfolioAPI = {
  // Public endpoints
  getAll: (params?: any) => api.get('/portfolio', { params }),
  getBySlug: (slug: string) => api.get(`/portfolio/${slug}`),
  getFeatured: (limit?: number) => api.get('/portfolio/featured', { params: { limit } }),
  getCategories: () => api.get('/portfolio/categories'),
  
  // Admin endpoints
  admin: {
    getAll: (params?: any) => api.get('/portfolio/admin/all', { params }),
    getById: (id: number) => api.get(`/portfolio/admin/${id}`),
    create: (data: any) => api.post('/portfolio/admin', data),
    update: (id: number, data: any) => api.put(`/portfolio/admin/${id}`, data),
    delete: (id: number) => api.delete(`/portfolio/admin/${id}`),
    getStats: () => api.get('/portfolio/admin/stats'),
  }
};

// Settings API
export const settingsAPI = {
  // Public settings
  getPublic: () => api.get('/settings/public'),
  getPublicByKey: (key: string) => api.get(`/settings/public/${key}`),
  
  // Admin settings endpoints
  admin: {
    getAll: (params?: any) => api.get('/settings/admin/all', { params }),
    getByType: (type: string) => api.get(`/settings/admin/type/${type}`),
    getByKey: (key: string) => api.get(`/settings/admin/${key}`),
    update: (key: string, data: any) => api.put(`/settings/admin/${key}`, data),
    updateBulk: (settings: any) => api.put('/settings/admin/bulk', { settings }),
    delete: (key: string) => api.delete(`/settings/admin/${key}`),
    
    // Legacy compatibility routes
    getMarketingIntegrations: () => api.get('/settings/marketing-integrations'),
    updateMarketingIntegrations: (data: any) => api.put('/settings/marketing-integrations', { marketingIntegrations: data }),
    getBillingSettings: () => api.get('/settings/billing-settings'),
    updateBillingSettings: (data: any) => api.put('/settings/billing-settings', { billingSettings: data }),
  }
};

// Contact API
export const contactAPI = {
  submit: (data: any) => api.post('/contact', data),
};

// Reviews API
export const reviewsAPI = {
  // Public endpoints
  submit: (data: any) => api.post('/reviews', data),
  getAll: (params?: any) => api.get('/reviews', { params }),
  getApproved: (limit?: number) => api.get('/reviews/approved', { params: { limit } }),
  getFeatured: (limit?: number) => api.get('/reviews/featured', { params: { limit } }),
  
  // Admin endpoints
  admin: {
    getAll: (params?: any) => api.get('/reviews/admin/all', { params }),
    getById: (id: number) => api.get(`/reviews/admin/${id}`),
    update: (id: number, data: any) => api.put(`/reviews/admin/${id}`, data),
    delete: (id: number) => api.delete(`/reviews/admin/${id}`),
    approve: (id: number) => api.put(`/reviews/admin/${id}/approve`),
    reject: (id: number) => api.put(`/reviews/admin/${id}/reject`),
    toggleFeatured: (id: number) => api.put(`/reviews/admin/${id}/toggle-featured`),
    updateDisplayOrder: (id: number, order: number) => api.put(`/reviews/admin/${id}/display-order`, { order }),
  }
};

// Analytics API
export const analyticsAPI = {
  trackEvent: (data: any) => api.post('/analytics/events', data),
  getStats: () => api.get('/analytics/stats'),
};

// Admin API
export const adminAPI = {
  // Products
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: number, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),
  
  // Orders
  getAllOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: number, status: string) => 
    api.put(`/admin/orders/${id}/status`, { status }),
  
  // Users
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  
  // Dashboard and Stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getSalesReport: (params?: any) => api.get('/admin/analytics/sales', { params }),
  
  // Blog Posts (Legacy routes using new backend)
  getAllPosts: (params?: any) => api.get('/admin/posts', { params }),
  getPost: (id: number) => api.get(`/admin/posts/${id}`),
  createPost: (data: any) => api.post('/admin/posts', data),
  updatePost: (id: number, data: any) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id: number) => api.delete(`/admin/posts/${id}`),
  
  // Portfolio Items (Legacy routes using new backend) 
  getAllPortfolio: (params?: any) => api.get('/admin/portfolio', { params }),
  getPortfolioItem: (id: number) => api.get(`/admin/portfolio/${id}`),
  createPortfolioItem: (data: any) => api.post('/admin/portfolio', data),
  updatePortfolioItem: (id: number, data: any) => api.put(`/admin/portfolio/${id}`, data),
  deletePortfolioItem: (id: number) => api.delete(`/admin/portfolio/${id}`),
  
  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  
  // Services
  getAllServices: () => api.get('/admin/services'),
  getService: (id: number) => api.get(`/admin/services/${id}`),
  createService: (data: any) => api.post('/admin/services', data),
  updateService: (id: number, data: any) => api.put(`/admin/services/${id}`, data),
  deleteService: (id: number) => api.delete(`/admin/services/${id}`),
  
  // Service Details
  getServiceDetail: (slug: string) => api.get(`/admin/services/${slug}/detail`),
  updateServiceDetail: (slug: string, data: any) => api.put(`/admin/services/${slug}/detail`, data),
  
  // Team
  getAllTeam: () => api.get('/admin/team'),
  getTeamMember: (id: number) => api.get(`/admin/team/${id}`),
  createTeamMember: (data: any) => api.post('/admin/team', data),
  updateTeamMember: (id: number, data: any) => api.put(`/admin/team/${id}`, data),
  deleteTeamMember: (id: number) => api.delete(`/admin/team/${id}`),
  
  // Reviews
  getAllReviews: () => api.get('/admin/reviews'),
  updateReviewStatus: (id: number, status: string) => api.put(`/admin/reviews/${id}/status`, { status }),
  deleteReview: (id: number) => api.delete(`/admin/reviews/${id}`),
  
  // Contacts
  getAllContacts: (params?: any) => api.get('/admin/contacts', { params }),
  getContact: (id: number) => api.get(`/admin/contacts/${id}`),
  updateContactStatus: (id: number, status: string) => api.put(`/admin/contacts/${id}/status`, { status }),
  updateContactPriority: (id: number, priority: string) => api.put(`/admin/contacts/${id}/priority`, { priority }),
  assignContact: (id: number, assigned_to: number) => api.put(`/admin/contacts/${id}/assign`, { assigned_to }),
  addContactNote: (id: number, note: string) => api.put(`/admin/contacts/${id}/notes`, { note }),
  deleteContact: (id: number) => api.delete(`/admin/contacts/${id}`),
  getContactStats: (period?: number) => api.get('/admin/contacts/stats', { params: { period } }),
  exportContacts: (params?: any) => api.get('/admin/contacts/export', { params }),
  
  // Content Management
  getContentManagement: () => api.get('/admin/content-management'),
  updateContentManagement: (data: any) => api.put('/admin/content-management', data),
  
  // FAQ Management
  getFAQ: () => api.get('/admin/faq'),
  updateFAQ: (data: any) => api.put('/admin/faq', data),
  
  // Mission Points
  getMissionPoints: () => api.get('/admin/mission-points'),
  updateMissionPoints: (data: any) => api.put('/admin/mission-points', data),
  
  // Process Phases
  getProcessPhases: () => api.get('/admin/process-phases'),
  updateProcessPhases: (data: any) => api.put('/admin/process-phases', data),
  
  // Site Identity
  getSiteIdentity: () => api.get('/admin/site-identity'),
  updateSiteIdentity: (data: any) => api.put('/admin/site-identity', data),
  
  // Contact Info
  getContactInfo: () => api.get('/admin/contact-info'),
  updateContactInfo: (data: any) => api.put('/admin/contact-info', data),
  
  // Footer Content
  getFooterContent: () => api.get('/admin/footer-content'),
  updateFooterContent: (data: any) => api.put('/admin/footer-content', data),
  
  // Navigation
  getNavigation: () => api.get('/admin/navigation'),
  updateNavigation: (data: any) => api.put('/admin/navigation', data),
  
  // Marketing Integrations
  getMarketingIntegrations: () => api.get('/admin/marketing-integrations'),
  updateMarketingIntegrations: (data: any) => api.put('/admin/marketing-integrations', data),
  
  // Billing Settings
  getBillingSettings: () => api.get('/admin/billing-settings'),
  updateBillingSettings: (data: any) => api.put('/admin/billing-settings', data),
};

export default api; 