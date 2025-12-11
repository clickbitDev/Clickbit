import { 
  Code2, 
  ShoppingCart, 
  Globe, 
  Database, 
  Smartphone, 
  Monitor, 
  Cloud, 
  Server, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  FileText, 
  Palette, 
  PenTool, 
  Search, 
  Mail, 
  TrendingUp, 
  Bot, 
  Cpu, 
  Network, 
  Settings, 
  Package, 
  Rocket, 
  Building, 
  Crown,
  Briefcase,
  Lock,
  HardDrive,
  Activity,
  Headphones,
  GraduationCap,
  Printer,
  CreditCard,
  Key,
  Wrench,
  Factory,
  Target,
  Hash,
  UserCheck,
  PaintBucket,
  MousePointer,
  Megaphone,
  DollarSign,
  Layers,
  Link
} from 'lucide-react';

// Icon mapping for service categories
export const categoryIcons: { [key: string]: any } = {
  'Development': Code2,
  'Infrastructure': Server,
  'Business Systems': Building,
  'Design & Branding': Palette,
  'Marketing & Growth': TrendingUp,
  'Specialized Tech': Cpu,
  'Business Packages': Package,
};

// Unique icon mapping for each of the 27 services in database
export const serviceIcons: { [key: string]: any } = {
  // Development Services (5 services)
  'custom-apps': Code2,              // Custom Web Applications
  'web-dev': Globe,                  // Website Development  
  'mobile-apps': Smartphone,         // Mobile App Development
  'desktop-software': Monitor,       // Custom Desktop Software

  // Infrastructure Services (7 services)
  'server-solutions': Server,        // Managed Server Solutions
  'cloud-solutions': Cloud,          // Cloud Solutions & Migration
  'network-infrastructure': Network, // Network Infrastructure & Design
  'data-storage': HardDrive,         // Data Storage Solutions
  'integration': Link,               // Software Setup & Integration
  'support': Headphones,             // Maintenance & Support

  // Specialized Tech Services (2 services)
  'ai-ml': Bot,                      // AI & Machine Learning Solutions
  'data-analytics': BarChart3,       // Data Management & Analytics

  // Business Systems Services (4 services)
  'crm': Users,                      // CRM Implementation & Customization
  'erp': Factory,                    // ERP Integration & Consulting
  'hrm': UserCheck,                  // HRM System Implementation
  'scm': Package,                    // SCM System Solutions

  // Design & Branding Services (4 services)
  'branding': PaintBucket,           // Branding & Identity
  'ui-ux': MousePointer,             // UI/UX Design
  'graphic-design': PenTool,         // Graphic Design
  'printing': Printer,               // Printing Services

  // Marketing & Growth Services (4 services)
  'strategy': Target,                // Digital Marketing Strategy
  'digital-marketing': Megaphone,    // Strategic Digital Marketing
  'ppc': DollarSign,                 // Paid Advertising (PPC)
  'email-hosting': Mail,             // Professional Email Hosting

  // Business Packages Services (3 services)
  'startup-package': Rocket,         // Startup Package
  'small-business-package': Briefcase, // Small Business Package
  'ultimate-package': Crown,         // Ultimate Package
};

// Function to get category icon
export const getCategoryIcon = (categoryName: string) => {
  return categoryIcons[categoryName] || Code2;
};

// Function to get service icon by slug
export const getServiceIcon = (slug: string, serviceName?: string, category?: string) => {
  // Direct slug match (preferred method)
  if (serviceIcons[slug]) {
    return serviceIcons[slug];
  }
  
  // Fallback based on category if slug not found
  if (category) {
    return getCategoryIcon(category);
  }
  
  // Final fallback
  return Settings;
};

// Function to get service icon by name (for backwards compatibility)
export const getServiceIconByName = (serviceName: string, category?: string) => {
  // Convert service name to slug format for lookup
  const slug = serviceName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return getServiceIcon(slug, serviceName, category);
};