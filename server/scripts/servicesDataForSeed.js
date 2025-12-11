// Cleaned for backend seeding: no icons, no extra braces, no TS code

/**
 * ==================================================================
 * SERVICES SUMMARY
 * A summarized list of all services, grouped by category.
 * ==================================================================
 */
exports.services = {
    development: {
      name: 'Development',
      slug: 'development',
      items: [
        { name: 'Custom Web Applications', desc: 'Scalable solutions for complex business needs.', href: '/services/custom-apps' },
        { name: 'Website Development', desc: 'High-performance websites on any platform.', href: '/services/web-dev', popular: true },
        { name: 'Mobile App Development', desc: 'Crafting native and hybrid mobile apps for iOS and Android.', href: '/services/mobile-apps', popular: true },
        { name: 'Custom Desktop Software', desc: 'Custom desktop software tailored to your business needs.', href: '/services/desktop-software', popular: true },
      ],
    },
    infrastructure: {
      name: 'Infrastructure',
      slug: 'infrastructure',
      items: [
        { name: 'Managed Server Solutions', desc: 'Comprehensive setup, configuration, and management of your digital infrastructure.', href: '/services/server-solutions', popular: true },
        { name: 'Cloud Solutions & Migration', desc: 'Scalable and cost-effective cloud solutions, including migration and management.', href: '/services/cloud-solutions', popular: true },
        { name: 'Network Infrastructure & Design', desc: 'Design and management of secure network infrastructures.', href: '/services/network-infrastructure', popular: true },
        { name: 'Data Storage Solutions', desc: 'Diverse data storage solutions, from on-premise to cloud-based.', href: '/services/data-storage', popular: true },
        { name: 'Software Setup & Integration', desc: 'Seamlessly connect your business systems for automated workflows.', href: '/services/integration', popular: true },
        { name: 'Maintenance & Support', desc: 'Keeping your digital assets secure, updated, and performing optimally.', href: '/services/support', popular: true },
      ],
    },
    specializedTech: {
      name: 'Specialized Tech',
      slug: 'specialized-tech',
      items: [
        { name: 'AI & Machine Learning Solutions', desc: 'Cutting-edge AI and Machine Learning for data analysis, prediction, and automation.', href: '/services/ai-ml', popular: true },
        { name: 'Data Management & Analytics', desc: 'Comprehensive data management and analytics to turn raw data into actionable insights.', href: '/services/data-analytics', popular: true },
      ],
    },
    businessSystems: {
      name: 'Business Systems',
      slug: 'business-systems',
      items: [
        { name: 'CRM Implementation & Customization', desc: 'Implementing and customizing CRM systems to optimize customer interactions.', href: '/services/crm', popular: true },
        { name: 'ERP Integration & Consulting', desc: 'Expertise in ERP systems to integrate and manage core business processes.', href: '/services/erp', popular: true },
        { name: 'HRM System Implementation', desc: 'Specializing in HRM systems to streamline HR operations.', href: '/services/hrm', popular: true },
        { name: 'SCM System Solutions', desc: 'Supply Chain Management systems to optimize the flow of goods and services.', href: '/services/scm', popular: true },
      ],
    },
    design: {
      name: 'Design & Branding',
      slug: 'design-and-branding',
      items: [
        { name: 'Branding & Identity', desc: 'Crafting memorable brands that stand out from the competition.', href: '/services/branding', popular: true },
        { name: 'UI/UX Design', desc: 'User-centric designs for intuitive and engaging digital experiences.', href: '/services/ui-ux', popular: true },
        { name: 'Graphic Design', desc: 'Visual assets that communicate your message and strengthen your brand.', href: '/services/graphic-design', popular: true },
        { name: 'Printing Services', desc: 'High-quality printing for all your business needs, from cards to banners.', href: '/services/printing', popular: true },
      ],
    },
    packages: {
      name: 'Business Packages',
      slug: 'business-packages',
      items: [
        { name: 'Startup Package', desc: 'Essential services for new businesses starting their journey.', href: '/services/startup-package', popular: true },
        { name: 'Small Business Package', desc: 'Comprehensive solutions for growing small businesses.', href: '/services/small-business-package', popular: true },
        { name: 'Ultimate Package', desc: 'The definitive solution for established market leaders seeking transformation.', href: '/services/ultimate-package', popular: true },
      ],
    },
    marketing: {
      name: 'Marketing & Growth',
      slug: 'marketing-and-growth',
      items: [
        { name: 'Strategic Digital Marketing', desc: 'Integrated strategies like SEO and content marketing to expand your online reach.', href: '/services/digital-marketing', popular: true },
        { name: 'Digital Marketing Strategy', desc: 'A clear, actionable roadmap for sustainable online growth.', href: '/services/strategy', popular: true },
        { name: 'Paid Advertising (PPC)', desc: 'Targeted campaigns on platforms like Google Ads for immediate impact.', href: '/services/ppc', popular: true },
        { name: 'Professional Email Hosting', desc: 'Reliable and secure email hosting for a professional business image.', href: '/services/email-hosting', popular: true },
      ],
    },
  };
  
  /**
   * ==================================================================
   * SERVICE DETAILS
   * Contains detailed information for each service page.
   * ==================================================================
   */
  exports.serviceDetails = {
    'web-dev': {
      slug: 'web-dev',
      title: 'Website Development',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Simple and flexible. Only pay for what you need.',
        tiers: [
          {
            name: 'Starter',
            subtitle: 'Perfect for startups & small businesses',
            price: '$1,500',
            priceSuffix: '/website',
            features: [
              'Custom WordPress Website',
              'Responsive Design (Mobile-First)',
              'Up to 8 Pages',
              'Contact Form Integration',
              'Basic SEO Optimization',
              'Google Analytics Setup',
              '2 Weeks Delivery',
              '1 Month Support',
              'Domain & Hosting (1 Year)',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=starter-web-dev',
          },
          {
            name: 'Professional',
            subtitle: 'Ideal for growing businesses',
            price: '$3,500',
            priceSuffix: '/website',
            features: [
              'Custom React/Next.js Website',
              'Advanced Responsive Design',
              'Up to 15 Pages',
              'E-commerce Integration',
              'Advanced SEO Optimization',
              'Performance Optimization',
              'Content Management System',
              '3 Weeks Delivery',
              '3 Months Support',
              'Premium Hosting (1 Year)',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-web-dev',
            isPopular: true,
          },
          {
            name: 'Enterprise',
            subtitle: 'The ultimate solution for large organizations',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Full-Stack Custom Development',
              'Unlimited Pages & Features',
              'Advanced E-commerce Platform',
              'Custom Integrations',
              'Enterprise SEO Strategy',
              'Performance & Security Audit',
              'Dedicated Project Manager',
              'Custom Timeline',
              '6 Months Support',
              'Premium Infrastructure',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-web-dev',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Crafting Digital Experiences That Drive Results',
          paragraphs: [
            "In today's digital-first world, your website is often the first impression potential customers have of your business. We don't just build websites – we create powerful digital experiences that convert visitors into customers and drive measurable business growth.",
            "Our development process combines cutting-edge technology with proven design principles to deliver websites that are not only visually stunning but also highly functional, fast, and optimized for conversions."
          ]
        },
        {
          type: 'text-only',
          title: 'Why Choose ClickBit for Your Website Development?',
          paragraphs: [
            "We understand that every business has unique needs and goals. That's why we take a personalized approach to every project, ensuring your website perfectly aligns with your brand and business objectives."
          ],
          list: [
            'Custom Design & Development: Every website we create is uniquely tailored to your brand and business needs',
            'Mobile-First Approach: We ensure your website looks and performs perfectly on all devices',
            'SEO-Optimized: Built with search engines in mind to help you rank higher and attract more visitors',
            'Fast & Secure: Optimized for speed and security to provide the best user experience',
            'Ongoing Support: We don\'t just build and leave – we provide ongoing support and maintenance',
            'Scalable Solutions: Your website grows with your business, not against it'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Development Process',
          paragraphs: [
            "We follow a proven, collaborative process that ensures your project is delivered on time, within budget, and exceeds your expectations. From initial concept to final launch, we work closely with you every step of the way.",
            "Our agile methodology allows for flexibility and continuous improvement throughout the development process, ensuring the final product perfectly matches your vision."
          ]
        },
        {
          type: 'text-only',
          title: 'Technologies We Use',
          paragraphs: [
            "We stay at the forefront of web development technology to deliver cutting-edge solutions that perform exceptionally well and provide the best user experience possible."
          ],
          list: [
            'Frontend: React.js, Next.js, TypeScript, Tailwind CSS',
            'Backend: Node.js, Python, PHP, WordPress',
            'Databases: MongoDB, PostgreSQL, MySQL',
            'Cloud Services: AWS, Vercel, Netlify',
            'E-commerce: Shopify, WooCommerce, Custom Solutions',
            'Performance: CDN, Image Optimization, Caching'
          ]
        }
      ],
    },
    'custom-apps': {
      slug: 'custom-apps',
      title: 'Custom Web Applications',
      headerImage: '/images/work/project2.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Scalable solutions for complex business needs.',
        tiers: [
          {
            name: 'Basic',
            subtitle: 'Simple web applications for small businesses',
            price: '$5,000',
            priceSuffix: '/app',
            features: [
              'Single-Page Application (SPA)',
              'User Authentication System',
              'Basic CRUD Operations',
              'Responsive Design',
              'Database Integration',
              '6 Weeks Delivery',
              '2 Months Support',
              'Basic Documentation',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-custom-app',
          },
          {
            name: 'Advanced',
            subtitle: 'Complex applications for growing businesses',
            price: '$15,000',
            priceSuffix: '/app',
            features: [
              'Multi-Page Application',
              'Advanced User Management',
              'Real-time Features',
              'API Integration',
              'Advanced Security',
              'Performance Optimization',
              '8 Weeks Delivery',
              '4 Months Support',
              'Comprehensive Documentation',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=advanced-custom-app',
            isPopular: true,
          },
          {
            name: 'Enterprise',
            subtitle: 'Large-scale applications for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Microservices Architecture',
              'Advanced Analytics Dashboard',
              'Multi-tenant System',
              'Custom Integrations',
              'Scalable Infrastructure',
              'Advanced Security & Compliance',
              'Dedicated Team',
              'Custom Timeline',
              '6 Months Support',
              'Training & Handover',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-custom-app',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Building Scalable Solutions for Complex Business Needs',
          paragraphs: [
            "Custom web applications are the backbone of modern business operations. We develop tailored solutions that streamline your processes, enhance productivity, and provide competitive advantages in your industry.",
            "From simple internal tools to complex enterprise systems, our custom applications are built with scalability, security, and user experience in mind."
          ],
          image: '/images/work/project1.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Choose Custom Web Applications?',
          paragraphs: [
            "Off-the-shelf solutions often come with limitations that can hinder your business growth. Custom web applications provide the flexibility and functionality you need to stay ahead of the competition."
          ],
          list: [
            'Tailored to Your Business: Built specifically for your unique processes and requirements',
            'Scalable Architecture: Designed to grow with your business needs',
            'Enhanced Security: Custom security measures tailored to your specific threats',
            'Integration Capabilities: Seamlessly connects with your existing systems',
            'Cost-Effective: Long-term savings compared to multiple off-the-shelf solutions',
            'Competitive Advantage: Unique features that set you apart from competitors'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Development Approach',
          paragraphs: [
            "We follow a systematic approach to custom application development, ensuring every project is delivered on time and exceeds expectations. Our process includes thorough planning, iterative development, and comprehensive testing.",
            "We work closely with your team to understand your business processes and create solutions that truly add value to your operations."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Technologies & Frameworks',
          paragraphs: [
            "We leverage the latest technologies and frameworks to build robust, scalable, and maintainable custom applications."
          ],
          list: [
            'Frontend: React.js, Vue.js, Angular, TypeScript',
            'Backend: Node.js, Python (Django/Flask), Java (Spring), .NET',
            'Databases: PostgreSQL, MySQL, MongoDB, Redis',
            'Cloud Platforms: AWS, Azure, Google Cloud',
            'DevOps: Docker, Kubernetes, CI/CD Pipelines',
            'APIs: RESTful APIs, GraphQL, WebSocket'
          ]
        }
      ],
    },
    'mobile-apps': {
      slug: 'mobile-apps',
      title: 'Mobile App Development',
      headerImage: '/images/work/project3.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Native and hybrid mobile apps for iOS and Android.',
        tiers: [
          {
            name: 'Starter',
            subtitle: 'Basic mobile apps for small businesses',
            price: '$8,000',
            priceSuffix: '/app',
            features: [
              'Cross-Platform App (React Native)',
              'Basic UI/UX Design',
              'Core Features Implementation',
              'App Store Submission',
              'Basic Testing',
              '8 Weeks Delivery',
              '2 Months Support',
              'Basic Documentation',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=starter-mobile-app',
          },
          {
            name: 'Professional',
            subtitle: 'Advanced mobile apps with premium features',
            price: '$25,000',
            priceSuffix: '/app',
            features: [
              'Native iOS & Android Apps',
              'Advanced UI/UX Design',
              'Complex Features & Integrations',
              'Push Notifications',
              'Analytics Integration',
              'Performance Optimization',
              '12 Weeks Delivery',
              '4 Months Support',
              'Comprehensive Testing',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-mobile-app',
            isPopular: true,
          },
          {
            name: 'Enterprise',
            subtitle: 'Large-scale mobile solutions for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Multi-Platform Strategy',
              'Advanced Security Features',
              'Custom Integrations',
              'Real-time Synchronization',
              'Offline Capabilities',
              'Advanced Analytics',
              'Dedicated Development Team',
              'Custom Timeline',
              '6 Months Support',
              'App Store Optimization',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-mobile-app',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Crafting Native and Hybrid Mobile Apps for iOS and Android',
          paragraphs: [
            "Mobile apps have become essential for businesses to connect with their customers and streamline operations. We develop high-performance mobile applications that deliver exceptional user experiences across all devices.",
            "Whether you need a native app for maximum performance or a cross-platform solution for cost efficiency, we have the expertise to bring your mobile vision to life."
          ],
          image: '/images/work/project1.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Invest in Mobile App Development?',
          paragraphs: [
            "Mobile apps provide unique opportunities to engage with your customers and streamline your business operations in ways that websites simply cannot match."
          ],
          list: [
            'Enhanced User Engagement: Apps provide better user experience than mobile websites',
            'Offline Functionality: Users can access features even without internet connection',
            'Push Notifications: Direct communication channel with your users',
            'Better Performance: Native apps are faster and more responsive',
            'Access to Device Features: Camera, GPS, sensors, and more',
            'Increased Customer Loyalty: Apps keep your brand top-of-mind'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Mobile Development Process',
          paragraphs: [
            "We follow industry best practices for mobile app development, ensuring your app is not only functional but also secure, scalable, and user-friendly. Our process includes thorough planning, iterative development, and comprehensive testing.",
            "From concept to app store submission, we handle every aspect of your mobile app development journey."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Mobile Technologies We Use',
          paragraphs: [
            "We stay current with the latest mobile development technologies to deliver cutting-edge solutions that perform exceptionally well."
          ],
          list: [
            'Native Development: Swift (iOS), Kotlin (Android)',
            'Cross-Platform: React Native, Flutter, Xamarin',
            'Backend: Node.js, Python, Firebase',
            'Databases: SQLite, Realm, Core Data',
            'Cloud Services: AWS, Google Cloud, Azure',
            'Testing: Jest, Detox, Appium'
          ]
        }
      ],
    },
    'desktop-software': {
      slug: 'desktop-software',
      title: 'Custom Desktop Software',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Custom desktop software tailored to your business needs.',
        tiers: [
          {
            name: 'Basic',
            subtitle: 'Simple desktop applications',
            price: '$6,000',
            priceSuffix: '/app',
            features: [
              'Single-Platform Application',
              'Basic UI Design',
              'Core Functionality',
              'Local Database',
              'Basic Security',
              '8 Weeks Delivery',
              '2 Months Support',
              'Installation Guide',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-desktop-software',
          },
          {
            name: 'Professional',
            subtitle: 'Advanced desktop applications',
            price: '$18,000',
            priceSuffix: '/app',
            features: [
              'Multi-Platform Support',
              'Advanced UI/UX Design',
              'Complex Features',
              'Database Integration',
              'Advanced Security',
              'Performance Optimization',
              '12 Weeks Delivery',
              '4 Months Support',
              'User Training',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-desktop-software',
            isPopular: true,
          },
          {
            name: 'Enterprise',
            subtitle: 'Large-scale desktop solutions',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Enterprise Architecture',
              'Advanced Integrations',
              'Multi-User Support',
              'Advanced Security & Compliance',
              'Custom Reporting',
              'Scalable Infrastructure',
              'Dedicated Development Team',
              'Custom Timeline',
              '6 Months Support',
              'Comprehensive Training',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-desktop-software',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Custom Desktop Software Tailored to Your Business Needs',
          paragraphs: [
            "Desktop software remains essential for many business operations, providing powerful tools that can work offline and integrate deeply with your existing systems. We develop custom desktop applications that streamline your workflows and boost productivity.",
            "From simple productivity tools to complex enterprise systems, our desktop software solutions are built with reliability, security, and user experience in mind."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Benefits of Custom Desktop Software',
          paragraphs: [
            "Custom desktop software provides unique advantages that web applications cannot match, especially for businesses with specific operational requirements."
          ],
          list: [
            'Offline Functionality: Work without internet connection',
            'Better Performance: Direct access to system resources',
            'Enhanced Security: Local data storage and processing',
            'System Integration: Deep integration with existing software',
            'Custom Workflows: Tailored to your specific business processes',
            'Cost Efficiency: No ongoing subscription fees'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Desktop Development Process',
          paragraphs: [
            "We follow a comprehensive development process that ensures your desktop software meets all requirements and exceeds expectations. Our approach includes thorough analysis, iterative development, and extensive testing.",
            "We work closely with your team to understand your specific needs and create solutions that truly enhance your business operations."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Desktop Technologies We Use',
          paragraphs: [
            "We leverage modern technologies to build robust, secure, and user-friendly desktop applications that integrate seamlessly with your existing infrastructure."
          ],
          list: [
            'Cross-Platform: Electron, Qt, .NET MAUI',
            'Windows: C#, WPF, WinForms, UWP',
            'macOS: Swift, Objective-C, Cocoa',
            'Linux: Python, C++, GTK',
            'Databases: SQLite, PostgreSQL, MySQL',
            'Security: Encryption, Authentication, Authorization'
          ]
        }
      ],
    },
    'server-solutions': {
      slug: 'server-solutions',
      title: 'Managed Server Solutions',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Reliable and secure server management.',
        tiers: [
          {
            name: 'Basic',
            subtitle: 'Essential server management for small businesses',
            price: '$299',
            priceSuffix: '/month',
            features: [
              'Server Setup & Configuration',
              'Basic Monitoring & Alerts',
              'Security Updates & Patches',
              'Backup Management',
              '24/7 Uptime Monitoring',
              'Email Support',
              'Monthly Health Reports',
              'Basic Performance Optimization',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-server-solutions',
          },
          {
            name: 'Professional',
            subtitle: 'Comprehensive server management for growing businesses',
            price: '$599',
            priceSuffix: '/month',
            features: [
              'Advanced Server Configuration',
              'Real-time Monitoring & Alerts',
              'Automated Security Updates',
              'Disaster Recovery Planning',
              'Performance Optimization',
              'Load Balancing Setup',
              'Priority Support (4-hour response)',
              'Weekly Health Reports',
              'SSL Certificate Management',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-server-solutions',
            isPopular: true,
          },
          {
            name: 'Enterprise',
            subtitle: 'Full-service server management for large organizations',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Custom Server Architecture',
              'High Availability Setup',
              'Advanced Security Hardening',
              'Automated Scaling',
              'Custom Monitoring Dashboards',
              'Dedicated Server Administrator',
              '24/7 Phone Support',
              'Daily Health Reports',
              'Compliance & Audit Support',
              'Custom Integration Support',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-server-solutions',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Comprehensive Server Management for Optimal Performance',
          paragraphs: [
            "Your server infrastructure is the backbone of your digital operations. Our managed server solutions provide comprehensive setup, configuration, and ongoing management to ensure your servers run at peak performance while maintaining the highest security standards.",
            "From initial provisioning to continuous monitoring and maintenance, we handle all aspects of server management so you can focus on your core business activities."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Choose Managed Server Solutions?',
          paragraphs: [
            "Managed server solutions provide businesses with enterprise-level infrastructure without the complexity and cost of maintaining an in-house IT team."
          ],
          list: [
            'Expert Management: Our certified engineers handle all server operations',
            '24/7 Monitoring: Continuous monitoring ensures maximum uptime',
            'Security First: Proactive security measures and regular updates',
            'Cost Effective: No need for expensive in-house server administration',
            'Scalable Solutions: Infrastructure that grows with your business',
            'Peace of Mind: Focus on your business while we manage your servers'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Server Management Process',
          paragraphs: [
            "We follow a systematic approach to server management that ensures optimal performance, security, and reliability. Our process includes thorough assessment, strategic planning, and continuous optimization.",
            "From initial setup to ongoing maintenance, we provide transparent communication and detailed reporting so you always know the status of your infrastructure."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Server Technologies We Manage',
          paragraphs: [
            "We have expertise in managing servers across all major platforms and technologies, ensuring your infrastructure is built on proven, reliable solutions."
          ],
          list: [
            'Operating Systems: Linux (Ubuntu, CentOS, RHEL), Windows Server',
            'Cloud Platforms: AWS EC2, Azure VMs, Google Compute Engine',
            'Web Servers: Apache, Nginx, IIS',
            'Database Servers: MySQL, PostgreSQL, MongoDB, SQL Server',
            'Application Servers: Node.js, Python, Java, .NET',
            'Monitoring: Nagios, Zabbix, Prometheus, Grafana'
          ]
        }
      ],
    },
    'cloud-solutions': {
      slug: 'cloud-solutions',
      title: 'Cloud Solutions & Migration',
      headerImage: '/images/work/project2.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Scalable and cost-effective cloud solutions.',
        tiers: [
          {
            name: 'Migration',
            subtitle: 'Seamless migration to the cloud',
            price: '$5,000',
            priceSuffix: '/project',
            features: [
              'Cloud Strategy Assessment',
              'Migration Planning & Design',
              'Data Migration Services',
              'Application Migration',
              'Testing & Validation',
              'Go-Live Support',
              'Post-Migration Optimization',
              '30 Days Support',
              'Migration Documentation',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=migration-cloud-solutions',
          },
          {
            name: 'Managed Cloud',
            subtitle: 'Complete cloud infrastructure management',
            price: '$1,200',
            priceSuffix: '/month',
            features: [
              'Cloud Infrastructure Design',
              'Multi-Cloud Strategy',
              'Cost Optimization',
              'Security & Compliance',
              'Auto-scaling Setup',
              'Backup & Disaster Recovery',
              'Performance Monitoring',
              '24/7 Cloud Support',
              'Monthly Cost Reports',
              'Security Audits',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=managed-cloud-solutions',
            isPopular: true,
          },
          {
            name: 'Enterprise Cloud',
            subtitle: 'Custom enterprise cloud solutions',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Custom Cloud Architecture',
              'Hybrid Cloud Solutions',
              'Advanced Security Setup',
              'Global CDN Configuration',
              'Custom Integrations',
              'Dedicated Cloud Engineer',
              'SLA Guarantees',
              'Compliance Frameworks',
              'Custom Monitoring',
              'Training & Handover',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-cloud-solutions',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Transform Your Business with Cloud Technology',
          paragraphs: [
            "Cloud computing has revolutionized how businesses operate, offering unprecedented scalability, flexibility, and cost efficiency. Our cloud solutions and migration services help you harness the full power of cloud technology to drive your business forward.",
            "Whether you're looking to migrate existing systems to the cloud or build new cloud-native applications, we provide the expertise and guidance to ensure a successful transition."
          ],
          image: '/images/work/project1.jpg',
        },
        {
          type: 'text-only',
          title: 'Benefits of Cloud Migration',
          paragraphs: [
            "Moving to the cloud offers numerous advantages that can transform your business operations and competitive position."
          ],
          list: [
            'Cost Savings: Pay only for what you use with no upfront infrastructure costs',
            'Scalability: Instantly scale resources up or down based on demand',
            'Flexibility: Access your applications and data from anywhere, anytime',
            'Security: Enterprise-grade security with regular updates and patches',
            'Disaster Recovery: Built-in backup and recovery solutions',
            'Performance: Global CDN and optimized infrastructure for faster performance'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Cloud Migration Process',
          paragraphs: [
            "We follow a proven methodology for cloud migration that minimizes risk and ensures a smooth transition. Our process includes thorough planning, careful execution, and ongoing optimization to maximize the benefits of your cloud investment.",
            "From initial assessment to post-migration optimization, we work closely with your team to ensure every aspect of the migration is handled professionally."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Cloud Platforms & Services',
          paragraphs: [
            "We work with all major cloud providers and can help you choose the best platform for your specific needs, or implement a multi-cloud strategy for maximum flexibility."
          ],
          list: [
            'AWS: EC2, S3, RDS, Lambda, CloudFront, Route 53',
            'Azure: Virtual Machines, Blob Storage, SQL Database, Functions',
            'Google Cloud: Compute Engine, Cloud Storage, Cloud SQL',
            'Kubernetes: Container orchestration and management',
            'Serverless: AWS Lambda, Azure Functions, Google Cloud Functions',
            'Monitoring: CloudWatch, Azure Monitor, Stackdriver'
          ]
        }
      ],
    },
    'network-infrastructure': {
      slug: 'network-infrastructure',
      title: 'Network Infrastructure & Design',
      headerImage: '/images/work/project3.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Secure and efficient network design.',
        tiers: [
          {
            name: 'Basic Setup',
            subtitle: 'Essential network infrastructure for small offices',
            price: '$3,500',
            priceSuffix: '/setup',
            features: [
              'Network Assessment & Design',
              'Router & Switch Configuration',
              'WiFi Network Setup',
              'Basic Security Implementation',
              'Network Documentation',
              'Staff Training',
              '30 Days Support',
              'Basic Monitoring Setup',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-network-infrastructure',
          },
          {
            name: 'Professional',
            subtitle: 'Advanced network solutions for growing businesses',
            price: '$8,500',
            priceSuffix: '/setup',
            features: [
              'Comprehensive Network Design',
              'Advanced Security Implementation',
              'VLAN Configuration',
              'Load Balancing Setup',
              'Network Monitoring Tools',
              'Disaster Recovery Planning',
              '3 Months Support',
              'Performance Optimization',
              'Security Audits',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-network-infrastructure',
            isPopular: true,
          },
          {
            name: 'Enterprise',
            subtitle: 'Large-scale network infrastructure for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Custom Network Architecture',
              'Multi-site Network Design',
              'Advanced Security & Firewalls',
              'High Availability Setup',
              'Custom Monitoring Solutions',
              'Network Automation',
              'Dedicated Network Engineer',
              'Ongoing Management',
              'Compliance & Audit Support',
              '24/7 Network Support',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-network-infrastructure',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Building the Foundation for Digital Success',
          paragraphs: [
            "A robust network infrastructure is the backbone of modern business operations. Our network design and implementation services create secure, scalable, and high-performance networks that support your business growth and digital transformation initiatives.",
            "From small office networks to complex enterprise infrastructures, we design and implement networks that provide reliable connectivity, enhanced security, and optimal performance for all your business applications."
          ],
          image: '/images/work/project1.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Invest in Professional Network Infrastructure?',
          paragraphs: [
            "A well-designed network infrastructure provides the foundation for all your digital operations and can significantly impact your business efficiency and security."
          ],
          list: [
            'Reliable Connectivity: Ensures consistent access to applications and data',
            'Enhanced Security: Protects your business from cyber threats and data breaches',
            'Scalability: Network that grows with your business needs',
            'Performance: Optimized for speed and efficiency',
            'Cost Efficiency: Reduces downtime and maintenance costs',
            'Future-Proof: Designed to accommodate emerging technologies'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Network Design Process',
          paragraphs: [
            "We follow a comprehensive approach to network design that ensures your infrastructure meets current needs while providing room for future growth. Our process includes thorough analysis, strategic planning, and careful implementation.",
            "From initial assessment to final testing and documentation, we ensure every aspect of your network infrastructure is designed and implemented to the highest standards."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Network Technologies & Solutions',
          paragraphs: [
            "We work with leading network equipment manufacturers and technologies to deliver reliable, secure, and high-performance network solutions."
          ],
          list: [
            'Switching: Cisco, HP, Dell, Ubiquiti',
            'Routing: Enterprise routers and firewalls',
            'Wireless: Enterprise WiFi with seamless roaming',
            'Security: Firewalls, VPN, IDS/IPS, Access Control',
            'Monitoring: Network monitoring and management tools',
            'Cabling: Structured cabling and fiber optic solutions'
          ]
        }
      ],
    },
    'data-storage': {
      slug: 'data-storage',
      title: 'Data Storage Solutions',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Secure and scalable data storage.',
        tiers: [
          {
            name: 'Basic Storage',
            subtitle: 'Essential data storage for small businesses',
            price: '$150',
            priceSuffix: '/month',
            features: [
              '500GB Cloud Storage',
              'Automated Backups',
              'Data Encryption',
              'File Sharing & Collaboration',
              'Version Control',
              'Mobile Access',
              'Email Support',
              'Basic Recovery Tools',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-data-storage',
          },
          {
            name: 'Professional Storage',
            subtitle: 'Advanced storage solutions for growing businesses',
            price: '$450',
            priceSuffix: '/month',
            features: [
              '2TB Cloud Storage',
              'Advanced Backup Solutions',
              'Disaster Recovery',
              'Data Deduplication',
              'Advanced Security',
              'Performance Optimization',
              'Priority Support',
              'Compliance Features',
              'Custom Retention Policies',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-data-storage',
            isPopular: true,
          },
          {
            name: 'Enterprise Storage',
            subtitle: 'Large-scale storage for enterprise needs',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Unlimited Storage',
              'Custom Storage Architecture',
              'High Availability Setup',
              'Advanced Analytics',
              'Custom Integrations',
              'Dedicated Storage Engineer',
              '24/7 Support',
              'Compliance & Audit',
              'Custom SLAs',
              'Training & Handover',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-data-storage',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Secure and Scalable Data Storage for Modern Businesses',
          paragraphs: [
            "Data is the lifeblood of modern business operations. Our data storage solutions provide secure, scalable, and reliable storage infrastructure that grows with your business needs while ensuring your valuable data is always protected and accessible.",
            "From cloud-based storage to hybrid solutions, we implement storage architectures that optimize performance, reduce costs, and provide the flexibility your business requires."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Choose Professional Data Storage Solutions?',
          paragraphs: [
            "Professional data storage solutions provide businesses with the reliability, security, and scalability needed to manage growing data requirements effectively."
          ],
          list: [
            'Data Security: Enterprise-grade encryption and security measures',
            'Scalability: Storage that grows with your business needs',
            'Reliability: High availability and redundancy for data protection',
            'Cost Efficiency: Optimized storage solutions that reduce costs',
            'Compliance: Solutions that meet industry and regulatory requirements',
            'Performance: Fast access to data when and where you need it'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Data Storage Implementation Process',
          paragraphs: [
            "We follow a systematic approach to data storage implementation that ensures your data is secure, accessible, and efficiently managed. Our process includes assessment, design, implementation, and ongoing optimization.",
            "From initial planning to ongoing management, we ensure your storage solution is tailored to your specific needs and provides the performance and reliability your business requires."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Storage Technologies & Platforms',
          paragraphs: [
            "We work with leading storage technologies and platforms to deliver reliable, secure, and high-performance storage solutions."
          ],
          list: [
            'Cloud Storage: AWS S3, Azure Blob Storage, Google Cloud Storage',
            'On-Premise: NAS, SAN, DAS solutions',
            'Hybrid Storage: Combination of cloud and on-premise solutions',
            'Backup Solutions: Automated backup and disaster recovery',
            'File Systems: Distributed file systems and object storage',
            'Monitoring: Storage monitoring and management tools'
          ]
        }
      ],
    },
    'integration': {
      slug: 'integration',
      title: 'Software Setup & Integration',
      headerImage: '/images/work/project2.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Connecting your business systems seamlessly.',
        tiers: [
          {
            name: 'Basic Integration',
            subtitle: 'Essential system connections for small businesses',
            price: '$2,500',
            priceSuffix: '/project',
            features: [
              'System Assessment',
              'Basic API Integration',
              'Data Mapping',
              'Testing & Validation',
              'Documentation',
              '30 Days Support',
              'Basic Training',
              'Go-Live Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-integration',
          },
          {
            name: 'Advanced Integration',
            subtitle: 'Complex integrations for growing businesses',
            price: '$8,000',
            priceSuffix: '/project',
            features: [
              'Comprehensive System Analysis',
              'Custom API Development',
              'Real-time Data Sync',
              'Advanced Error Handling',
              'Performance Optimization',
              'Security Implementation',
              '3 Months Support',
              'Comprehensive Training',
              'Monitoring Setup',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=advanced-integration',
            isPopular: true,
          },
          {
            name: 'Enterprise Integration',
            subtitle: 'Large-scale integration for enterprise systems',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Enterprise Architecture Design',
              'Custom Middleware Development',
              'Multi-system Integration',
              'Advanced Security & Compliance',
              'Custom Workflows',
              'Dedicated Integration Engineer',
              'Ongoing Support & Maintenance',
              'Compliance & Audit Support',
              'Custom SLAs',
              'Training & Handover',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-integration',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Seamlessly Connect Your Business Systems',
          paragraphs: [
            "Modern businesses rely on multiple software systems to manage different aspects of their operations. Our software setup and integration services create seamless connections between your systems, eliminating data silos and automating workflows.",
            "From simple API integrations to complex enterprise system connections, we ensure your software ecosystem works together efficiently, providing a unified view of your business operations."
          ],
          image: '/images/work/project1.jpg',
        },
        {
          type: 'text-only',
          title: 'Benefits of System Integration',
          paragraphs: [
            "Proper system integration provides numerous advantages that can transform your business operations and improve efficiency."
          ],
          list: [
            'Eliminate Data Silos: Single source of truth across all systems',
            'Automate Workflows: Reduce manual data entry and processing',
            'Improve Efficiency: Streamlined processes and faster operations',
            'Better Decision Making: Access to comprehensive, real-time data',
            'Cost Savings: Reduced manual work and fewer errors',
            'Enhanced Customer Experience: Seamless interactions across touchpoints'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Integration Process',
          paragraphs: [
            "We follow a proven methodology for system integration that ensures reliable, secure, and efficient connections between your business systems. Our process includes thorough analysis, careful planning, and comprehensive testing.",
            "From initial assessment to final deployment and ongoing support, we work closely with your team to ensure every integration meets your specific business requirements."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Integration Technologies & Platforms',
          paragraphs: [
            "We work with a wide range of integration technologies and platforms to connect your systems efficiently and reliably."
          ],
          list: [
            'APIs: REST, GraphQL, SOAP web services',
            'Middleware: Message queues, event streaming, ETL tools',
            'Platforms: Zapier, Microsoft Power Automate, MuleSoft',
            'Databases: SQL, NoSQL, data warehouses',
            'Cloud Services: AWS, Azure, Google Cloud integration',
            'Security: OAuth, API keys, encryption, authentication'
          ]
        }
      ],
    },
    'support': {
      slug: 'support',
      title: 'Maintenance & Support',
      headerImage: '/images/work/project3.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Keeping your digital assets secure and updated.',
        tiers: [
          {
            name: 'Basic Support',
            subtitle: 'Essential maintenance for small businesses',
            price: '$199',
            priceSuffix: '/month',
            features: [
              'Monthly Security Updates',
              'Basic Monitoring',
              'Email Support',
              'Backup Verification',
              'Performance Checks',
              'Basic Troubleshooting',
              'Monthly Reports',
              'Emergency Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-support',
          },
          {
            name: 'Professional Support',
            subtitle: 'Comprehensive support for growing businesses',
            price: '$499',
            priceSuffix: '/month',
            features: [
              'Weekly Security Updates',
              '24/7 Monitoring',
              'Priority Support (4-hour response)',
              'Proactive Maintenance',
              'Performance Optimization',
              'Security Audits',
              'Weekly Reports',
              'Phone Support',
              'Emergency Response',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=professional-support',
            isPopular: true,
          },
          {
            name: 'Enterprise Support',
            subtitle: 'Full-service support for enterprise needs',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Daily Security Updates',
              'Real-time Monitoring',
              'Dedicated Support Engineer',
              'Custom Maintenance Plans',
              'Advanced Security Measures',
              'Compliance Support',
              'Daily Reports',
              '24/7 Phone Support',
              'SLA Guarantees',
              'Custom SLAs',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-support',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Proactive Maintenance and Reliable Support',
          paragraphs: [
            "Your digital infrastructure requires ongoing care and attention to maintain optimal performance and security. Our maintenance and support services provide proactive monitoring, regular updates, and reliable technical support to keep your systems running smoothly.",
            "From routine maintenance to emergency response, we ensure your digital assets are secure, up-to-date, and performing at their best, allowing you to focus on your core business activities."
          ],
          image: '/images/work/project1.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Choose Professional Maintenance & Support?',
          paragraphs: [
            "Professional maintenance and support services provide businesses with the reliability and peace of mind needed to operate confidently in today's digital landscape."
          ],
          list: [
            'Proactive Maintenance: Prevent issues before they become problems',
            'Security Updates: Keep your systems protected against threats',
            'Performance Optimization: Ensure optimal system performance',
            'Reliable Support: Expert help when you need it most',
            'Cost Efficiency: Reduce downtime and maintenance costs',
            'Peace of Mind: Focus on your business while we handle the technical details'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Support and Maintenance Process',
          paragraphs: [
            "We follow a systematic approach to maintenance and support that ensures your systems remain secure, efficient, and reliable. Our process includes regular monitoring, proactive maintenance, and responsive support.",
            "From scheduled maintenance to emergency response, we provide comprehensive coverage that keeps your digital infrastructure running smoothly and securely."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Support Services & Technologies',
          paragraphs: [
            "We provide comprehensive support and maintenance services across a wide range of technologies and platforms."
          ],
          list: [
            'System Monitoring: Real-time monitoring and alerting',
            'Security Management: Updates, patches, and security audits',
            'Backup Management: Automated backups and disaster recovery',
            'Performance Tuning: Optimization and capacity planning',
            'Troubleshooting: Problem diagnosis and resolution',
            'Documentation: System documentation and knowledge base'
          ]
        }
      ],
    },
    'ai-ml': {
      slug: 'ai-ml',
      title: 'AI & Machine Learning Solutions',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Harness the power of AI for your business.',
        tiers: [
          {
            name: 'AI Consultation',
            subtitle: 'Strategic guidance on AI implementation',
            price: '$2,500',
            priceSuffix: '/project',
            features: [
              'AI Strategy Workshop',
              'Use Case Identification',
              'Technology Stack Recommendation',
              'Feasibility Analysis',
              'Roadmap Development',
              'ROI Analysis',
              'Basic PoC Design',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=ai-consultation',
          },
          {
            name: 'ML Model Development',
            subtitle: 'Custom machine learning models',
            price: '$10,000',
            priceSuffix: '/model',
            features: [
              'Data Analysis & Preprocessing',
              'Custom Model Development',
              'Model Training & Tuning',
              'Performance Evaluation',
              'API Integration',
              'Documentation',
              '3 Months Support',
              'Scalability Planning',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=ml-model-development',
            isPopular: true,
          },
          {
            name: 'Enterprise AI',
            subtitle: 'Large-scale AI solutions for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'End-to-end AI Solution',
              'Advanced Model Deployment',
              'Continuous Learning Setup',
              'Real-time Analytics',
              'Dedicated AI/ML Engineer',
              'Ongoing Model Management',
              'Custom SLAs',
              'Compliance & Governance',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-ai',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Unlock Business Value with AI & Machine Learning',
          paragraphs: [
            "Artificial Intelligence and Machine Learning are transforming industries by enabling businesses to automate processes, gain deeper insights from data, and create innovative products and services. We help you leverage these cutting-edge technologies to solve complex challenges and drive growth.",
            "Our team of data scientists and engineers builds custom AI/ML solutions tailored to your specific business needs, from predictive analytics to natural language processing."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Implement AI & Machine Learning?',
          paragraphs: [
            "Integrating AI/ML into your operations can provide a significant competitive advantage and unlock new opportunities for innovation and efficiency."
          ],
          list: [
            'Data-Driven Decisions: Make smarter decisions based on predictive insights',
            'Process Automation: Automate repetitive tasks and improve efficiency',
            'Personalized Experiences: Deliver tailored experiences to your customers',
            'Enhanced Security: Detect and respond to threats more effectively',
            'Innovation: Create new products and services powered by AI',
            'Competitive Edge: Stay ahead of the competition with advanced technology'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our AI/ML Development Process',
          paragraphs: [
            "We follow a structured process to ensure the successful development and deployment of AI/ML solutions. Our methodology covers everything from data collection and preparation to model training, evaluation, and deployment.",
            "We work closely with your team to understand your business objectives and ensure that the final solution delivers measurable value and integrates seamlessly into your existing workflows."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'AI/ML Technologies We Use',
          paragraphs: [
            "We utilize a wide range of industry-leading tools and frameworks to build high-performance, scalable, and reliable AI/ML solutions."
          ],
          list: [
            'Languages: Python, R',
            'Frameworks: TensorFlow, PyTorch, Scikit-learn, Keras',
            'Platforms: AWS SageMaker, Azure Machine Learning, Google AI Platform',
            'Big Data: Apache Spark, Hadoop',
            'Data Visualization: Matplotlib, Seaborn, Tableau',
            'NLP: NLTK, SpaCy, Transformers'
          ]
        }
      ],
    },
    'data-analytics': {
      slug: 'data-analytics',
      title: 'Data Management & Analytics',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Turn your data into actionable insights.',
        tiers: [
          {
            name: 'Data Setup',
            subtitle: 'Essential data infrastructure setup',
            price: '$3,000',
            priceSuffix: '/project',
            features: [
              'Data Source Identification',
              'Data Warehouse Setup',
              'ETL Pipeline Implementation',
              'Basic Data Modeling',
              'Dashboard Setup (1 Dashboard)',
              'Documentation',
              '30 Days Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=data-setup',
          },
          {
            name: 'Advanced Analytics',
            subtitle: 'Comprehensive analytics for growing businesses',
            price: '$7,500',
            priceSuffix: '/project',
            features: [
              'Advanced Data Modeling',
              'Custom ETL Pipelines',
              'Interactive Dashboards (Up to 5)',
              'Predictive Analytics',
              'Data Governance Framework',
              'Performance Optimization',
              '3 Months Support',
              'Team Training',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=advanced-analytics',
            isPopular: true,
          },
          {
            name: 'Enterprise Analytics',
            subtitle: 'Full-scale data solutions for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Enterprise Data Strategy',
              'Real-time Data Processing',
              'Advanced Machine Learning Models',
              'Unlimited Dashboards',
              'Dedicated Data Engineer',
              'Ongoing Management & Optimization',
              'Custom SLAs',
              'Compliance & Security Audits',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-analytics',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Unlock the Power of Your Data',
          paragraphs: [
            "In a data-driven world, the ability to collect, manage, and analyze data is critical for success. Our data management and analytics services help you transform raw data into actionable insights that drive business growth and innovation.",
            "We design and implement robust data architectures, build automated data pipelines, and create insightful visualizations to help you make informed decisions."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Invest in Data Management & Analytics?',
          paragraphs: [
            "Effective data management and analytics can provide a clear view of your business performance and unlock new opportunities for growth."
          ],
          list: [
            'Informed Decisions: Base your strategies on data, not guesswork',
            'Operational Efficiency: Identify bottlenecks and optimize processes',
            'Customer Insights: Understand customer behavior and preferences',
            'New Revenue Streams: Discover new opportunities and markets',
            'Risk Management: Identify and mitigate risks proactively',
            'Competitive Advantage: Outperform competitors with data-driven strategies'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Data Analytics Process',
          paragraphs: [
            "We follow a structured approach to data analytics, ensuring that our solutions are aligned with your business goals. Our process covers everything from data discovery and collection to analysis, visualization, and ongoing support.",
            "We work collaboratively with your team to understand your challenges and deliver solutions that provide clear, actionable insights and integrate seamlessly with your existing systems."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Data & Analytics Technologies We Use',
          paragraphs: [
            "We use a wide range of modern tools and platforms to build scalable and efficient data management and analytics solutions."
          ],
          list: [
            'Databases: PostgreSQL, MySQL, SQL Server, BigQuery, Redshift',
            'ETL Tools: Fivetran, Stitch, Airflow',
            'BI Tools: Tableau, Power BI, Looker, Metabase',
            'Data Warehousing: Snowflake, Google BigQuery, Amazon Redshift',
            'Programming: Python, R, SQL',
            'Cloud Platforms: AWS, Azure, Google Cloud'
          ]
        }
      ],
    },
    'crm': {
      slug: 'crm',
      title: 'CRM Implementation & Customization',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Optimize your customer relationships.',
        tiers: [
          {
            name: 'CRM Setup',
            subtitle: 'Essential CRM setup for small businesses',
            price: '$3,500',
            priceSuffix: '/project',
            features: [
              'CRM Platform Selection',
              'Basic Setup & Configuration',
              'Data Import (up to 1,000 records)',
              'Standard Dashboard Setup',
              'User Training (up to 5 users)',
              '30 Days Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=crm-setup',
          },
          {
            name: 'CRM Customization',
            subtitle: 'Tailored CRM for growing businesses',
            price: '$9,000',
            priceSuffix: '/project',
            features: [
              'Advanced CRM Configuration',
              'Custom Fields & Objects',
              'Workflow Automation',
              'Third-Party Integrations',
              'Custom Reports & Dashboards',
              'Advanced User Training',
              '3 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=crm-customization',
            isPopular: true,
          },
          {
            name: 'Enterprise CRM',
            subtitle: 'Full-scale CRM solutions for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Custom CRM Development',
              'Advanced Workflow Automation',
              'Complex Integrations',
              'Data Migration & Cleansing',
              'Dedicated CRM Consultant',
              'Ongoing Management',
              'Custom SLAs',
              'Compliance & Security',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-crm',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Build Stronger Customer Relationships',
          paragraphs: [
            "Customer Relationship Management (CRM) systems are essential for managing interactions with current and potential customers. We help you implement and customize CRM platforms to streamline your sales, marketing, and customer service processes.",
            "From selecting the right CRM to customizing it to fit your unique workflows, we ensure your CRM becomes a central hub for all customer-related activities, driving efficiency and growth."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Benefits of a Well-Implemented CRM',
          paragraphs: [
            "A properly configured CRM can centralize your customer data, improve communication, and provide valuable insights into your sales and marketing efforts."
          ],
          list: [
            'Centralized Data: A single source of truth for all customer information',
            'Improved Efficiency: Automate tasks and streamline workflows',
            'Enhanced Communication: Better collaboration between teams',
            'Data-Driven Insights: Track sales performance and marketing ROI',
            'Better Customer Service: Quicker and more personalized support',
            'Increased Sales: Identify and nurture leads more effectively'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our CRM Implementation Process',
          paragraphs: [
            "We follow a structured process to ensure your CRM is implemented correctly and tailored to your specific business needs. Our approach includes discovery, planning, configuration, data migration, training, and ongoing support.",
            "We work closely with your team to understand your processes and ensure the CRM solution aligns with your goals, leading to higher user adoption and a greater return on your investment."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'CRM Platforms We Work With',
          paragraphs: [
            "We have expertise in a wide range of leading CRM platforms and can help you choose the best fit for your business, or customize your existing system."
          ],
          list: [
            'Salesforce',
            'HubSpot',
            'Zoho CRM',
            'Microsoft Dynamics 365',
            'Pipedrive',
            'Custom CRM Solutions'
          ]
        }
      ],
    },
    'erp': {
      slug: 'erp',
      title: 'ERP Integration & Consulting',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Integrate and manage your core business processes.',
        tiers: [
          {
            name: 'ERP Consultation',
            subtitle: 'Strategic guidance for ERP implementation',
            price: '$4,000',
            priceSuffix: '/project',
            features: [
              'Business Process Analysis',
              'ERP Vendor Selection',
              'Implementation Roadmap',
              'Requirements Gathering',
              'Basic Project Management',
              '30 Days Advisory Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=erp-consultation',
          },
          {
            name: 'ERP Integration',
            subtitle: 'Connecting your ERP with other systems',
            price: '$12,000',
            priceSuffix: '/project',
            features: [
              'ERP & CRM Integration',
              'Custom API Development',
              'Data Synchronization',
              'Workflow Automation',
              'User Training',
              '3 Months Support',
              'Performance Monitoring',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=erp-integration',
            isPopular: true,
          },
          {
            name: 'Enterprise ERP',
            subtitle: 'Full-scale ERP implementation & management',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'End-to-end ERP Implementation',
              'Custom Module Development',
              'Advanced Business Intelligence',
              'Ongoing System Management',
              'Dedicated ERP Consultant',
              'Custom SLAs',
              'Change Management & Training',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-erp',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Streamline Your Entire Business Operation',
          paragraphs: [
            "Enterprise Resource Planning (ERP) systems integrate all essential business functions into a single, cohesive system. We provide expert consulting and integration services to help you select, implement, and optimize an ERP system that aligns with your business goals.",
            "Our services ensure that your ERP system enhances visibility, improves efficiency, and provides the data-driven insights needed to make strategic decisions."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Advantages of an Integrated ERP System',
          paragraphs: [
            "An effective ERP system can break down data silos and provide a unified view of your business, leading to significant improvements in efficiency and decision-making."
          ],
          list: [
            'Unified View: A single source of truth for all business data',
            'Improved Efficiency: Automate core business processes',
            'Better Reporting: Real-time data and analytics for informed decisions',
            'Enhanced Collaboration: Seamless information flow between departments',
            'Scalability: A system that can grow with your business',
            'Regulatory Compliance: Simplify compliance and risk management'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our ERP Consulting & Integration Process',
          paragraphs: [
            "Our proven methodology ensures a successful ERP journey, from initial planning to post-implementation support. We focus on minimizing disruption and maximizing the value of your investment.",
            "We partner with you to understand your unique business processes, challenges, and goals, ensuring the final ERP solution is a perfect fit for your organization."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'ERP Systems We Specialize In',
          paragraphs: [
            "We have experience with a wide array of leading ERP solutions, ensuring we can provide the best-fit solution for your specific industry and needs."
          ],
          list: [
            'SAP S/4HANA',
            'Oracle NetSuite',
            'Microsoft Dynamics 365',
            'Odoo',
            'Epicor',
            'Infor'
          ]
        }
      ],
    },
    'hrm': {
      slug: 'hrm',
      title: 'HRM System Implementation',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Streamline your HR operations.',
        tiers: [
          {
            name: 'HRM Setup',
            subtitle: 'Essential HRM system setup for small businesses',
            price: '$3,000',
            priceSuffix: '/project',
            features: [
              'HRM Platform Selection',
              'Basic Setup & Configuration',
              'Employee Data Import',
              'Leave Management Setup',
              'User Training (up to 10 users)',
              '30 Days Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=hrm-setup',
          },
          {
            name: 'HRM Customization',
            subtitle: 'Tailored HRM for growing businesses',
            price: '$7,000',
            priceSuffix: '/project',
            features: [
              'Advanced HRM Configuration',
              'Recruitment Module Setup',
              'Performance Management',
              'Payroll Integration',
              'Custom Reports',
              'Advanced User Training',
              '3 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=hrm-customization',
            isPopular: true,
          },
          {
            name: 'Enterprise HRM',
            subtitle: 'Full-scale HRM solutions for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'End-to-end HRM Implementation',
              'Custom Module Development',
              'Advanced Analytics & Reporting',
              'Ongoing System Management',
              'Dedicated HRM Consultant',
              'Compliance & Security',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-hrm',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Modernize Your Human Resource Management',
          paragraphs: [
            "Human Resource Management (HRM) systems are vital for managing your most valuable asset: your people. We help you implement and customize HRM solutions to automate HR processes, from recruitment and onboarding to payroll and performance management.",
            "Our expertise ensures your HRM system is a powerful tool that improves efficiency, enhances employee engagement, and supports strategic HR initiatives."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Key Benefits of an HRM System',
          paragraphs: [
            "An effective HRM system can transform your HR department from an administrative function to a strategic partner in the business."
          ],
          list: [
            'Automated Processes: Reduce manual work in recruitment, payroll, and more',
            'Centralized Employee Data: A single source of truth for all employee information',
            'Improved Compliance: Stay up-to-date with labor laws and regulations',
            'Enhanced Employee Self-Service: Empower employees to manage their own information',
            'Better Reporting: Gain insights into your workforce with HR analytics',
            'Strategic HR: Free up HR staff to focus on strategic initiatives'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our HRM Implementation Approach',
          paragraphs: [
            "Our structured implementation process ensures your HRM system is configured to your specific needs and integrated smoothly into your organization. We focus on user adoption and long-term success.",
            "We guide you through every step, from selecting the right platform to configuring workflows, migrating data, and training your team, ensuring a seamless transition."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'HRM Platforms We Support',
          paragraphs: [
            "We are experienced in a variety of leading HRM platforms, allowing us to recommend and implement the best solution for your organization's size and complexity."
          ],
          list: [
            'BambooHR',
            'Workday',
            'SAP SuccessFactors',
            'Gusto',
            'Rippling',
            'Zoho People'
          ]
        }
      ],
    },
    'scm': {
      slug: 'scm',
      title: 'SCM System Solutions',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Optimize your supply chain from end to end.',
        tiers: [
          {
            name: 'SCM Consultation',
            subtitle: 'Strategic guidance for SCM optimization',
            price: '$4,500',
            priceSuffix: '/project',
            features: [
              'Supply Chain Analysis',
              'SCM Software Evaluation',
              'Process Mapping',
              'Implementation Roadmap',
              'Vendor Selection Support',
              '30 Days Advisory Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=scm-consultation',
          },
          {
            name: 'SCM Implementation',
            subtitle: 'Full SCM system setup and integration',
            price: '$15,000',
            priceSuffix: '/project',
            features: [
              'End-to-end SCM Implementation',
              'Inventory Management Setup',
              'Logistics & Warehouse Integration',
              'Supplier Collaboration Portal',
              'User Training',
              '3 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=scm-implementation',
            isPopular: true,
          },
          {
            name: 'Enterprise SCM',
            subtitle: 'Advanced supply chain solutions for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Custom SCM Module Development',
              'Advanced Analytics & Forecasting',
              'IoT & Blockchain Integration',
              'Ongoing System Management',
              'Dedicated SCM Consultant',
              'Global Supply Chain Visibility',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-scm',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Enhance Your Supply Chain Efficiency',
          paragraphs: [
            "Supply Chain Management (SCM) systems are critical for optimizing the flow of goods, services, and information from supplier to customer. We provide expert consulting and implementation services for SCM systems to enhance visibility, reduce costs, and improve efficiency.",
            "Our solutions help you manage inventory, logistics, and supplier relationships more effectively, giving you a competitive edge in the market."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Modernize Your Supply Chain?',
          paragraphs: [
            "A modern SCM system can provide real-time visibility and control over your entire supply chain, leading to significant business benefits."
          ],
          list: [
            'Cost Reduction: Optimize inventory levels and reduce waste',
            'Improved Visibility: Track goods and information in real-time',
            'Enhanced Collaboration: Better communication with suppliers and partners',
            'Increased Efficiency: Automate and streamline supply chain processes',
            'Greater Agility: Respond more quickly to market changes',
            'Better Customer Service: Improve on-time delivery and order accuracy'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our SCM Implementation Methodology',
          paragraphs: [
            "Our comprehensive approach to SCM implementation ensures that the solution is perfectly aligned with your business processes and objectives. We focus on delivering a system that provides tangible results.",
            "From process analysis and system selection to implementation, integration, and training, we manage the entire project to ensure a successful outcome."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'SCM Systems We Work With',
          paragraphs: [
            "We have in-depth knowledge of leading SCM platforms and can help you implement a solution that provides end-to-end visibility and control."
          ],
          list: [
            'SAP Integrated Business Planning (IBP)',
            'Oracle SCM Cloud',
            'Infor CloudSuite SCM',
            'Blue Yonder',
            'E2open',
            'Manhattan Associates'
          ]
        }
      ],
    },
    'branding': {
      slug: 'branding',
      title: 'Branding & Identity',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Crafting memorable brands that stand out.',
        tiers: [
          {
            name: 'Logo Design',
            subtitle: 'Professional logo for your business',
            price: '$1,200',
            priceSuffix: '/project',
            features: [
              '3 Logo Concepts',
              'Vector Source Files',
              'Color Palette',
              'Typography Selection',
              '2 Rounds of Revisions',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=logo-design',
          },
          {
            name: 'Brand Identity Package',
            subtitle: 'Complete visual identity for your brand',
            price: '$3,500',
            priceSuffix: '/project',
            features: [
              'Everything in Logo Design',
              'Business Card Design',
              'Letterhead & Envelope Design',
              'Social Media Profile Images',
              'Basic Brand Style Guide',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=brand-identity-package',
            isPopular: true,
          },
          {
            name: 'Full Branding Suite',
            subtitle: 'Comprehensive branding for a cohesive experience',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Everything in Brand Identity Package',
              'Marketing Collateral (Brochure, Flyer)',
              'Presentation Template',
              'Comprehensive Brand Guidelines',
              'Dedicated Brand Designer',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=full-branding-suite',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Visual Identity That Captures Your Essence',
          paragraphs: [
            "Your brand's visual identity is a critical component of how you are perceived. We specialize in creating unique and memorable branding that captures the essence of your business and communicates it effectively to your target audience.",
            "Our design process is rooted in strategy, ensuring that every visual element, from your logo to your color palette, works together to tell a cohesive and compelling story."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'The Power of a Strong Visual Identity',
          paragraphs: [
            "A consistent and professional visual identity can help you stand out in a crowded marketplace and build a lasting connection with your customers."
          ],
          list: [
            'Makes a Great First Impression',
            'Differentiates You From Competitors',
            'Creates a Memorable Experience',
            'Builds Brand Recognition and Loyalty',
            'Communicates Professionalism and Credibility',
            'Unifies Your Marketing Efforts'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Creative Design Process',
          paragraphs: [
            "Our design process is a partnership. We begin by diving deep into your business, your industry, and your goals. This allows us to create a visual identity that is not only beautiful but also strategically sound.",
            "Through conceptualization, refinement, and feedback, we craft a brand identity that you can be proud of and that will serve your business for years to come."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'What We Deliver',
          paragraphs: [
            "We provide a complete set of assets and guidelines to ensure your brand is represented consistently and professionally across all platforms."
          ],
          list: [
            'Custom Logo Design (multiple concepts)',
            'Color Palette and Typography',
            'Business Cards and Stationery',
            'Social Media Templates',
            'Comprehensive Brand Style Guide',
            'All Necessary Source Files'
          ]
        }
      ],
    },
    'ui-ux': {
      slug: 'ui-ux',
      title: 'UI/UX Design',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'User-centric designs for intuitive experiences.',
        tiers: [
          {
            name: 'UI/UX Audit',
            subtitle: 'Expert review of your existing product',
            price: '$1,500',
            priceSuffix: '/project',
            features: [
              'Heuristic Evaluation',
              'Usability Testing (3 users)',
              'User Flow Analysis',
              'Actionable Recommendations Report',
              'Competitor Analysis',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=ui-ux-audit',
          },
          {
            name: 'UI/UX Design Package',
            subtitle: 'Complete design for a new application',
            price: '$8,000',
            priceSuffix: '/project',
            features: [
              'User Research & Personas',
              'Wireframing & Prototyping',
              'High-Fidelity UI Design',
              'Interactive Prototype',
              'Full Design System',
              'Developer Handoff',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=ui-ux-package',
            isPopular: true,
          },
          {
            name: 'Enterprise UI/UX',
            subtitle: 'Ongoing design support for large products',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Dedicated UI/UX Designer',
              'Continuous User Research',
              'A/B Testing and Optimization',
              'Design System Management',
              'Cross-functional Collaboration',
              'Product Strategy Contribution',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-ui-ux',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Designing Digital Products People Love to Use',
          paragraphs: [
            "In today's competitive digital landscape, a great user experience (UX) and a beautiful user interface (UI) are no longer optional. Our UI/UX design services focus on creating products that are not only aesthetically pleasing but also intuitive, efficient, and enjoyable to use.",
            "We combine user research, data analysis, and creative design to craft experiences that meet user needs and achieve business goals."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'The Impact of Great UI/UX Design',
          paragraphs: [
            "Investing in UI/UX design can lead to higher user satisfaction, increased engagement, and a better return on investment for your digital product."
          ],
          list: [
            'Increased User Adoption and Retention',
            'Higher Customer Satisfaction and Loyalty',
            'Reduced Development Costs and Rework',
            'Improved Usability and Accessibility',
            'Stronger Brand Perception',
            'Higher Conversion Rates'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Human-Centered Design Process',
          paragraphs: [
            "Our design process puts the user at the center of every decision. We start by understanding your users' needs, behaviors, and pain points. This research informs every stage of the design process, from initial wireframes to final high-fidelity mockups.",
            "We believe in iterative design and continuous feedback, working closely with you and your users to create a product that truly shines."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Our UI/UX Design Services',
          paragraphs: [
            "We offer a comprehensive range of UI/UX services to support your product development lifecycle from concept to launch and beyond."
          ],
          list: [
            'User Research and Persona Development',
            'Information Architecture and User Flows',
            'Wireframing and Prototyping',
            'High-Fidelity UI Design',
            'Usability Testing and Analysis',
            'Design System Creation and Management'
          ]
        }
      ],
    },
    'graphic-design': {
      slug: 'graphic-design',
      title: 'Graphic Design',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Visual assets that communicate your message.',
        tiers: [
          {
            name: 'Single Asset',
            subtitle: 'A single graphic design asset',
            price: '$300',
            priceSuffix: '/asset',
            features: [
              'e.g., Social Media Post, Banner Ad',
              '2 Concepts',
              '2 Rounds of Revisions',
              'High-Resolution Files',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=single-asset',
          },
          {
            name: 'Marketing Package',
            subtitle: 'A bundle of essential marketing materials',
            price: '$1,500',
            priceSuffix: '/package',
            features: [
              'Brochure Design',
              'Flyer Design',
              'Social Media Post Templates (5)',
              'Business Card Design',
              '3 Rounds of Revisions',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=marketing-package',
            isPopular: true,
          },
          {
            name: 'Design Retainer',
            subtitle: 'Ongoing graphic design support',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Dedicated Graphic Designer',
              'Fixed number of hours per month',
              'Priority Turnaround',
              'All types of graphic design work',
              'Monthly Strategy Call',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=design-retainer',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Compelling Visuals for Your Brand',
          paragraphs: [
            "Great graphic design makes you look good. It makes your marketing materials more effective, your presentations more engaging, and your brand more memorable. We create high-quality visual assets that help you communicate your message with clarity and impact.",
            "From digital ads to print materials, our graphic design services cover all your needs, ensuring your brand looks professional and consistent across all touchpoints."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'The Role of Graphic Design in Your Business',
          paragraphs: [
            "Professional graphic design is a key ingredient in building a strong brand and effective marketing campaigns. It's an investment that pays off in increased engagement and credibility."
          ],
          list: [
            'Strengthens Your Brand Identity',
            'Increases Engagement on Social Media',
            'Makes Marketing Materials More Effective',
            'Improves Readability and Communication',
            'Builds Professionalism and Trust',
            'Sets You Apart From the Competition'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Design Workflow',
          paragraphs: [
            "Our design workflow is straightforward and collaborative. We start with a clear brief to understand your goals, target audience, and desired style. From there, we move to concept development, presenting you with options and refining them based on your feedback.",
            "We pride ourselves on clear communication and a streamlined process that delivers high-quality results on time and on budget."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Graphic Design Services We Offer',
          paragraphs: [
            "We provide a wide range of graphic design services to meet the diverse needs of our clients, from startups to established enterprises."
          ],
          list: [
            'Marketing & Advertising Materials (digital & print)',
            'Social Media Graphics & Templates',
            'Infographics & Data Visualization',
            'Presentations & Pitch Decks',
            'Reports & Whitepapers',
            'Signage & Environmental Graphics'
          ]
        }
      ],
    },
    'digital-marketing': {
      slug: 'digital-marketing',
      title: 'Strategic Digital Marketing',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Expand your online reach and grow your business.',
        tiers: [
          {
            name: 'SEO Foundation',
            subtitle: 'Essential SEO for new websites',
            price: '$1,000',
            priceSuffix: '/month',
            features: [
              'Keyword Research',
              'On-Page SEO Optimization',
              'Technical SEO Audit',
              'Google Analytics & Search Console Setup',
              'Monthly Performance Report',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=seo-foundation',
          },
          {
            name: 'Growth Marketing',
            subtitle: 'Integrated marketing for growing businesses',
            price: '$2,500',
            priceSuffix: '/month',
            features: [
              'Everything in SEO Foundation',
              'Content Marketing (2 articles/month)',
              'Link Building Campaign',
              'Social Media Management (2 platforms)',
              'Email Marketing Campaign',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=growth-marketing',
            isPopular: true,
          },
          {
            name: 'Enterprise Marketing',
            subtitle: 'Comprehensive digital marketing for enterprises',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Everything in Growth Marketing',
              'Advanced SEO & Content Strategy',
              'PPC Campaign Management',
              'Marketing Automation',
              'Conversion Rate Optimization (CRO)',
              'Dedicated Marketing Strategist',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-marketing',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Driving Growth Through Digital Channels',
          paragraphs: [
            "In today's digital world, a strong online presence is essential for business growth. Our strategic digital marketing services are designed to help you reach your target audience, build brand awareness, and generate leads and sales.",
            "We take an integrated approach, combining SEO, content marketing, social media, and other channels to create a comprehensive strategy that delivers measurable results."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Digital Marketing is Essential',
          paragraphs: [
            "Digital marketing allows you to connect with your customers where they spend their time: online. It's a powerful way to build relationships, drive engagement, and grow your business."
          ],
          list: [
            'Reach a Wider Audience',
            'Target Your Ideal Customers',
            'Measure Your ROI Accurately',
            'Build Brand Awareness and Loyalty',
            'Generate Leads and Sales',
            'Compete with Larger Businesses'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Data-Driven Approach',
          paragraphs: [
            "Our digital marketing strategies are built on a foundation of data and analytics. We continuously monitor campaign performance, analyze results, and optimize our approach to ensure we are delivering the best possible return on your investment.",
            "We believe in transparency and provide regular, detailed reports so you can see exactly how our efforts are contributing to your business goals."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Our Digital Marketing Services',
          paragraphs: [
            "We offer a full suite of digital marketing services to help you achieve your business objectives, whether you're looking to increase website traffic, generate leads, or boost online sales."
          ],
          list: [
            'Search Engine Optimization (SEO)',
            'Content Marketing',
            'Social Media Marketing',
            'Email Marketing',
            'Pay-Per-Click (PPC) Advertising',
            'Conversion Rate Optimization (CRO)'
          ]
        }
      ],
    },
    'strategy': {
      slug: 'strategy',
      title: 'Digital Marketing Strategy',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'A roadmap for sustainable online growth.',
        tiers: [
          {
            name: 'Marketing Audit',
            subtitle: 'Comprehensive review of your current marketing',
            price: '$2,000',
            priceSuffix: '/project',
            features: [
              'Website & SEO Audit',
              'Social Media Presence Review',
              'Competitor Analysis',
              'Actionable Recommendations Report',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=marketing-audit',
          },
          {
            name: 'Digital Strategy',
            subtitle: 'A complete digital marketing roadmap',
            price: '$5,000',
            priceSuffix: '/project',
            features: [
              'Everything in Marketing Audit',
              'Target Audience & Persona Definition',
              'Channel Strategy (SEO, Social, Content)',
              'Content Plan & Calendar',
              'KPIs and Measurement Framework',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=digital-strategy',
            isPopular: true,
          },
          {
            name: 'Fractional CMO',
            subtitle: 'Ongoing strategic leadership',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Everything in Digital Strategy',
              'Ongoing Strategic Guidance',
              'Marketing Team Management/Mentorship',
              'Budgeting and Forecasting',
              'Regular Performance Reviews',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=fractional-cmo',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Charting a Course for Digital Success',
          paragraphs: [
            "A solid strategy is the foundation of any successful digital marketing effort. Our digital marketing strategy service provides you with a clear and actionable roadmap for achieving your business goals online.",
            "We take the time to understand your business, your customers, and your competition to develop a tailored strategy that maximizes your return on investment."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'The Value of a Digital Marketing Strategy',
          paragraphs: [
            "Without a strategy, your marketing efforts can be disjointed and ineffective. A clear strategy ensures that all your marketing activities are working together to achieve a common goal."
          ],
          list: [
            'Provides Clear Direction and Focus',
            'Ensures Consistent Messaging',
            'Maximizes Your Marketing Budget',
            'Helps You Understand Your Audience Better',
            'Sets You Apart From the Competition',
            'Allows You to Measure What Matters'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Strategic Planning Process',
          paragraphs: [
            "Our strategic planning process is collaborative and data-driven. We start with a deep dive into your business and your market. We then work with you to define clear, measurable objectives and develop a comprehensive plan to achieve them.",
            "The result is a detailed strategy document that serves as your guide for all future digital marketing initiatives, complete with KPIs to track your progress."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Components of Our Digital Strategy',
          paragraphs: [
            "Our digital marketing strategies are comprehensive documents that cover all the key areas you need to succeed online."
          ],
          list: [
            'Business & Marketing Objectives',
            'Target Audience & Persona Development',
            'Competitive Analysis',
            'Channel & Tactic Recommendations',
            'Content Strategy & Plan',
            'Measurement & KPI Framework'
          ]
        }
      ],
    },
    'ppc': {
      slug: 'ppc',
      title: 'Paid Advertising (PPC)',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Targeted campaigns for immediate impact.',
        tiers: [
          {
            name: 'Campaign Setup',
            subtitle: 'Professional setup of one ad campaign',
            price: '$1,000',
            priceSuffix: '/setup',
            features: [
              'Keyword Research',
              'Ad Copywriting',
              'Landing Page Recommendations',
              'Campaign Setup on 1 Platform (e.g., Google Ads)',
              'Conversion Tracking Setup',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=ppc-setup',
          },
          {
            name: 'Campaign Management',
            subtitle: 'Ongoing management and optimization',
            price: '$1,500',
            priceSuffix: '/month',
            features: [
              'Includes Campaign Setup',
              'Ongoing Bid Management',
              'A/B Testing of Ads and Landing Pages',
              'Performance Monitoring & Optimization',
              'Monthly Performance Report',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=ppc-management',
            isPopular: true,
          },
          {
            name: 'Enterprise PPC',
            subtitle: 'Large-scale PPC management across multiple platforms',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Multi-platform Campaign Management',
              'Advanced Audience Targeting',
              'Custom Reporting Dashboard',
              'Conversion Rate Optimization (CRO)',
              'Dedicated PPC Specialist',
              'Weekly Performance Calls',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-ppc',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Drive Targeted Traffic and Leads with PPC',
          paragraphs: [
            "Pay-Per-Click (PPC) advertising is one of the most effective ways to drive targeted traffic to your website and generate leads and sales quickly. We create and manage highly effective PPC campaigns on platforms like Google Ads and social media.",
            "Our data-driven approach ensures that your ad spend is optimized for maximum return on investment, delivering measurable results that align with your business goals."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why Use Pay-Per-Click Advertising?',
          paragraphs: [
            "PPC offers a level of control and measurability that is hard to match with other marketing channels. It's a powerful tool for businesses of all sizes to reach their target audience."
          ],
          list: [
            'Immediate Results: Drive traffic to your website quickly',
            'Highly Targeted: Reach your ideal customers based on demographics, interests, and keywords',
            'Measurable ROI: Track every dollar spent and see exactly what you\'re getting in return',
            'Control Your Budget: Set your own ad spend and only pay when someone clicks',
            'Brand Exposure: Get your brand in front of a large, relevant audience',
            'A/B Testing: Test and optimize your ads and landing pages for better results'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our PPC Campaign Management Process',
          paragraphs: [
            "Our PPC management process is designed to deliver consistent results and a high return on ad spend. We start with in-depth research to understand your market and your customers. We then create compelling ad copy and landing pages designed to convert.",
            "Once your campaigns are live, we continuously monitor performance, making data-driven adjustments to optimize for your target KPIs."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'PPC Platforms We Manage',
          paragraphs: [
            "We have experience managing campaigns across all the major PPC platforms, allowing us to place your ads where your customers are most likely to see them."
          ],
          list: [
            'Google Ads (Search, Display, Shopping, YouTube)',
            'Microsoft Advertising (Bing Ads)',
            'Facebook & Instagram Ads',
            'LinkedIn Ads',
            'Twitter Ads',
            'Pinterest Ads'
          ]
        }
      ],
    },
    'email-hosting': {
      slug: 'email-hosting',
      title: 'Professional Email Hosting',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Reliable and secure email for your business.',
        tiers: [
          {
            name: 'Basic Email',
            subtitle: 'Professional email for small teams',
            price: '$10',
            priceSuffix: '/user/month',
            features: [
              '50GB Mailbox',
              'Spam & Virus Protection',
              'Webmail Access',
              'Mobile Sync',
              '99.9% Uptime Guarantee',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=basic-email',
          },
          {
            name: 'Business Email',
            subtitle: 'Advanced email and collaboration tools',
            price: '$20',
            priceSuffix: '/user/month',
            features: [
              'Everything in Basic Email',
              '100GB Mailbox',
              'Shared Calendars & Contacts',
              'Advanced Security Features',
              'Email Archiving',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=business-email',
            isPopular: true,
          },
          {
            name: 'Enterprise Email',
            subtitle: 'Full-featured email and compliance',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Everything in Business Email',
              'Unlimited Storage',
              'Advanced Compliance & eDiscovery',
              'Data Loss Prevention (DLP)',
              'Dedicated Support',
              'Custom Integration Options',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=enterprise-email',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Secure, Reliable, and Professional Email',
          paragraphs: [
            "Your email is a critical business tool. Our professional email hosting services provide you with a secure, reliable, and feature-rich email solution that you can count on. Get a professional email address that matches your domain name and build credibility with your customers.",
            "We offer a range of plans to meet the needs of businesses of all sizes, from solopreneurs to large enterprises, with features like spam protection, mobile sync, and shared calendars."
          ],
          image: '/images/work/project2.jpg',
        },
        {
          type: 'text-only',
          title: 'Why You Need Professional Email Hosting',
          paragraphs: [
            "Using a professional email address (e.g., you@yourcompany.com) is essential for building trust and brand recognition. It shows that you are a serious business and provides a more professional image than a free email address."
          ],
          list: [
            'Builds Credibility and Trust',
            'Promotes Your Brand with Every Email',
            'More Secure and Reliable than Free Email',
            'Advanced Features like Shared Calendars',
            'Better Control and Management',
            'Protects You From Spam and Viruses'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Email Hosting Services',
          paragraphs: [
            "We offer fully managed email hosting solutions from leading providers, ensuring you get a reliable and secure service without the hassle of managing it yourself. We can also help you migrate your existing email to a new platform with minimal disruption.",
            "Our team is here to help you choose the right plan, set up your accounts, and provide ongoing support to ensure your email is always up and running."
          ],
          image: '/images/work/project3.jpg',
        },
        {
          type: 'text-only',
          title: 'Email Platforms We Offer',
          paragraphs: [
            "We partner with the best email hosting providers in the industry to offer you a choice of platforms that are secure, reliable, and packed with features."
          ],
          list: [
            'Google Workspace (formerly G Suite)',
            'Microsoft 365 (formerly Office 365)',
            'Zoho Mail',
            'Fastmail',
            'ProtonMail for Business',
            'Custom Email Hosting Solutions'
          ]
        }
      ],
    },
    'printing': {
      slug: 'printing',
      title: 'Printing Services',
      headerImage: '/images/work/project3.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'High-quality printing for all your business needs.',
        tiers: [
          {
            name: 'Business Cards',
            subtitle: 'Professional business identity',
            price: 'From $0.44',
            priceSuffix: '/card (min 500)',
            features: [
              'Standard 350gsm Card Stock',
              'Full Color Printing',
              'Gloss or Matte Finish',
              'Quick Turnaround Available',
              'Free Design Consultation'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-business-cards',
          },
          {
            name: 'Flyers',
            subtitle: 'Effective promotional materials',
            price: 'From $0.48',
            priceSuffix: '/flyer (min 500)',
            features: [
              'A4 Size (210x297mm)',
              'Full Color Both Sides',
              '170gsm Gloss Paper',
              'Folded Options Available',
              'Same Day Printing Available'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-flyers',
            isPopular: true,
          },
          {
            name: 'Brochures',
            subtitle: 'Detailed marketing collateral',
            price: 'From $0.72',
            priceSuffix: '/brochure (min 500)',
            features: [
              'A4 Bi-fold or Tri-fold',
              'Full Color Printing',
              '200gsm Gloss Paper',
              'Professional Folding',
              'Custom Sizes Available'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-brochures',
          },
          {
            name: 'Banners',
            subtitle: 'Large format outdoor signage',
            price: 'From $170',
            priceSuffix: '/sqm',
            features: [
              'Vinyl Material',
              'UV Resistant Ink',
              'Eyelets for Hanging',
              'Custom Sizes Available',
              'Weather Resistant'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-banners',
          },
          {
            name: 'Pull-up Banners',
            subtitle: 'Portable display solutions',
            price: 'From $240',
            priceSuffix: '/banner',
            features: [
              '850x2000mm Standard Size',
              'Aluminum Base Included',
              'Roll-up Mechanism',
              'High-Resolution Printing',
              'Travel Case Available'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-pullup-banners',
          },
          {
            name: 'Letterheads',
            subtitle: 'Professional correspondence',
            price: 'From $0.14',
            priceSuffix: '/sheet (min 500)',
            features: [
              'A4 Size (210x297mm)',
              '100gsm Quality Paper',
              'Full Color Printing',
              'Custom Logo Placement',
              'Matching Envelopes Available'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-letterheads',
          },
          {
            name: 'Posters',
            subtitle: 'Eye-catching displays',
            price: 'From $1.60',
            priceSuffix: '/poster (min 100)',
            features: [
              'A3 Size (297x420mm)',
              'Full Color Printing',
              '170gsm Gloss Paper',
              'Custom Sizes Available',
              'Quick Turnaround'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-posters',
          },
          {
            name: 'Vehicle Wraps',
            subtitle: 'Mobile advertising solutions',
            price: 'From $300',
            priceSuffix: '/sqm',
            features: [
              'Premium Vinyl Material',
              'UV Resistant Ink',
              'Professional Installation',
              'Custom Design Service',
              'Warranty Included'
            ],
            cta: 'Get a Quote',
            ctaHref: '/contact?service=printing-vehicle-wraps',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Professional Printing Solutions',
          paragraphs: [
            "We offer a wide range of professional printing services to meet all your business needs. From business cards to large format banners, we deliver high-quality products that make an impact.",
            "Our state-of-the-art printing technology ensures vibrant colors and sharp details, every time. We work with you to choose the right materials and finishes to best represent your brand."
          ],
          image: '/images/work/project1.jpg'
        },
        {
          type: 'text-only',
          title: 'What We Print',
          paragraphs: [
            "We provide a comprehensive range of printing products. If you don't see what you're looking for, just ask!"
          ],
          list: [
            'Business Cards: A variety of stocks and finishes to make a great first impression.',
            'Marketing Materials: Flyers, brochures, and booklets to get the word out.',
            'Stationery: Letterheads, envelopes, and presentation folders for a professional touch.',
            'Large Format: Banners and signs to grab attention at events or your place of business.',
            'Custom Projects: We love a challenge! Contact us with your custom printing needs.'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Commitment to Quality',
          paragraphs: [
            "Quality is at the heart of everything we do. We use only the best materials and printing techniques to ensure your complete satisfaction.",
            "Our team of printing experts will guide you through the process, from selecting the right paper to final delivery, ensuring your project is a success."
          ],
          image: '/images/work/project2.jpg'
        },
        {
          type: 'text-only',
          title: 'Additional Services',
          paragraphs: [
            "Beyond printing, we offer a range of services to finish your project perfectly."
          ],
          list: [
            'Binding Services: Spiral, Coil, Wire, and Book Binding.',
            'Lamination: Protect and enhance your printed materials.',
            'Design Services: Need a design? Our creative team can help.',
            'Direct Mail: We can even handle the mailing of your printed materials.'
          ]
        }
      ],
    },
    'startup-package': {
      slug: 'startup-package',
      title: 'Startup Package',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Essential services for new businesses starting their journey.',
        tiers: [
          {
            name: 'Startup Essentials',
            subtitle: 'Perfect for new businesses getting started',
            price: '$3,500',
            priceSuffix: '/package',
            features: [
              'Professional Logo Design',
              'Basic Website (5 pages)',
              'Business Card Design & Printing (500)',
              'Social Media Setup (3 platforms)',
              'Basic SEO Setup',
              'Email Hosting (1 year)',
              'Brand Guidelines',
              '30 Days Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=startup-essentials',
          },
          {
            name: 'Startup Growth',
            subtitle: 'Comprehensive startup solution',
            price: '$7,500',
            priceSuffix: '/package',
            features: [
              'Everything in Startup Essentials',
              'Advanced Website (10 pages)',
              'E-commerce Integration',
              'Marketing Materials (Flyers, Brochures)',
              'Google Ads Setup',
              'Content Marketing (5 articles)',
              'Analytics & Reporting Setup',
              '3 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=startup-growth',
            isPopular: true,
          },
          {
            name: 'Startup Premium',
            subtitle: 'Complete startup package with ongoing support',
            price: '$12,000',
            priceSuffix: '/package',
            features: [
              'Everything in Startup Growth',
              'Custom Web Application',
              'Mobile App Development',
              'Comprehensive Marketing Strategy',
              'CRM Setup & Training',
              'Ongoing Marketing Support (6 months)',
              'Dedicated Account Manager',
              '6 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=startup-premium',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Launch Your Business with Confidence',
          paragraphs: [
            "Starting a business is exciting but can be overwhelming. Our startup packages provide everything you need to establish a strong foundation and hit the ground running.",
            "We understand the unique challenges startups face and have designed these packages to give you the essential tools and services needed to succeed in today's competitive market."
          ],
          image: '/images/work/project2.jpg'
        },
        {
          type: 'text-only',
          title: 'What\'s Included in Our Startup Packages',
          paragraphs: [
            "Our startup packages are designed to provide comprehensive solutions that cover all the essential aspects of launching and growing your business."
          ],
          list: [
            'Professional Brand Identity: Logo, colors, and brand guidelines',
            'Digital Presence: Website, social media, and online listings',
            'Marketing Materials: Business cards, flyers, and promotional items',
            'Digital Marketing: SEO, Google Ads, and content marketing',
            'Business Tools: Email hosting, CRM, and analytics setup',
            'Ongoing Support: Technical support and strategic guidance'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Why Choose Our Startup Packages?',
          paragraphs: [
            "We've helped hundreds of startups establish their digital presence and grow their businesses. Our packages are designed based on real-world experience and proven strategies.",
            "Each package is carefully crafted to provide maximum value while staying within startup budgets, ensuring you get professional results without breaking the bank."
          ],
          image: '/images/work/project3.jpg'
        },
        {
          type: 'text-only',
          title: 'Our Startup Success Process',
          paragraphs: [
            "We follow a proven process to ensure your startup gets off to the best possible start."
          ],
          list: [
            'Discovery & Strategy: Understanding your business and goals',
            'Design & Development: Creating your brand and digital presence',
            'Launch & Optimization: Going live and fine-tuning performance',
            'Growth & Support: Ongoing assistance to help you scale',
            'Analytics & Reporting: Tracking progress and measuring success'
          ]
        }
      ],
    },
    'small-business-package': {
      slug: 'small-business-package',
      title: 'Small Business Package',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'Comprehensive solutions for growing small businesses.',
        tiers: [
          {
            name: 'Small Business Essentials',
            subtitle: 'Essential services for established small businesses',
            price: '$5,500',
            priceSuffix: '/package',
            features: [
              'Brand Refresh & Strategy',
              'Professional Website Redesign',
              'Marketing Materials Package',
              'Social Media Management (3 months)',
              'SEO Optimization',
              'Google Business Profile Setup',
              'Email Marketing Setup',
              '3 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=small-business-essentials',
          },
          {
            name: 'Small Business Growth',
            subtitle: 'Comprehensive growth solution for small businesses',
            price: '$9,500',
            priceSuffix: '/package',
            features: [
              'Everything in Small Business Essentials',
              'E-commerce Website Development',
              'Digital Marketing Campaign',
              'Content Marketing Strategy',
              'CRM Implementation',
              'Analytics & Reporting Dashboard',
              'Staff Training & Documentation',
              '6 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=small-business-growth',
            isPopular: true,
          },
          {
            name: 'Small Business Premium',
            subtitle: 'Complete business transformation package',
            price: '$15,000',
            priceSuffix: '/package',
            features: [
              'Everything in Small Business Growth',
              'Custom Business Software',
              'Advanced Marketing Automation',
              'Business Process Optimization',
              'Cloud Infrastructure Setup',
              'Data Analytics & Insights',
              'Dedicated Business Consultant',
              '12 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=small-business-premium',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Scale Your Small Business to New Heights',
          paragraphs: [
            "Small businesses face unique challenges in today's digital landscape. Our small business packages are designed to help you compete with larger companies while maintaining the personal touch that makes your business special.",
            "We provide comprehensive solutions that address your specific needs, from digital transformation to marketing automation, helping you grow efficiently and sustainably."
          ],
          image: '/images/work/project2.jpg'
        },
        {
          type: 'text-only',
          title: 'Small Business Package Benefits',
          paragraphs: [
            "Our small business packages are designed to provide maximum impact while being cost-effective and scalable."
          ],
          list: [
            'Professional Digital Presence: Modern website and online branding',
            'Marketing Automation: Streamlined marketing processes',
            'Business Efficiency: CRM and process optimization',
            'Growth Tools: Analytics, reporting, and insights',
            'Competitive Advantage: Technology that levels the playing field',
            'Scalable Solutions: Systems that grow with your business'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Small Business Approach',
          paragraphs: [
            "We understand that small businesses need solutions that work hard for them. Our packages are designed to be practical, efficient, and results-driven.",
            "We focus on implementing systems and processes that will save you time and money while helping you attract more customers and increase your revenue."
          ],
          image: '/images/work/project3.jpg'
        },
        {
          type: 'text-only',
          title: 'Success Stories',
          paragraphs: [
            "We've helped numerous small businesses transform their operations and achieve significant growth."
          ],
          list: [
            'Increased online visibility and lead generation',
            'Streamlined business processes and improved efficiency',
            'Enhanced customer experience and satisfaction',
            'Reduced operational costs through automation',
            'Improved market position and competitive advantage',
            'Sustainable growth and scalability'
          ]
        }
      ],
    },
    'ultimate-package': {
      slug: 'ultimate-package',
      title: 'Ultimate Package',
      headerImage: '/images/work/project1.jpg',
      pricing: {
        superTitle: '/ pricing /',
        title: 'The definitive solution for established market leaders.',
        tiers: [
          {
            name: 'Business Transformation',
            subtitle: 'Comprehensive digital transformation for established businesses',
            price: '$8,500',
            priceSuffix: '/package',
            features: [
              'Complete Brand Overhaul',
              'Enterprise Website Development',
              'Digital Marketing Strategy',
              'Marketing Automation Setup',
              'CRM & ERP Integration',
              'Business Intelligence Dashboard',
              'Staff Training Program',
              '6 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=business-transformation',
          },
          {
            name: 'Business Excellence',
            subtitle: 'Advanced solutions for business optimization',
            price: '$18,000',
            priceSuffix: '/package',
            features: [
              'Everything in Business Transformation',
              'Custom Software Development',
              'Advanced Analytics & AI Integration',
              'Cloud Migration & Optimization',
              'Security & Compliance Setup',
              'Performance Optimization',
              'Dedicated Project Manager',
              '12 Months Support',
            ],
            cta: 'Get started',
            ctaHref: '/contact?service=business-excellence',
            isPopular: true,
          },
          {
            name: 'Business Enterprise',
            subtitle: 'Complete enterprise solution with ongoing partnership',
            price: 'Custom',
            priceSuffix: 'Quote',
            features: [
              'Everything in Business Excellence',
              'Full Digital Transformation',
              'Custom Enterprise Applications',
              'Advanced AI & Machine Learning',
              'Multi-location Management',
              '24/7 Support & Monitoring',
              'Dedicated Account Team',
              'Ongoing Strategic Partnership',
            ],
            cta: 'Get Custom Quote',
            ctaHref: '/contact?service=business-enterprise',
          },
        ],
      },
      sections: [
        {
          type: 'text-image-right',
          title: 'Transform Your Business for the Digital Age',
          paragraphs: [
            "Established businesses need to adapt to stay competitive in today's rapidly evolving digital landscape. Our business packages provide comprehensive solutions that modernize your operations and position you for future growth.",
            "We work with established companies to implement cutting-edge technology solutions while preserving the core values and processes that have made them successful."
          ],
          image: '/images/work/project2.jpg'
        },
        {
          type: 'text-only',
          title: 'Business Package Features',
          paragraphs: [
            "Our business packages are designed to provide enterprise-level solutions that drive real business results."
          ],
          list: [
            'Digital Transformation: Modernize your entire business',
            'Technology Integration: Seamless system integration',
            'Process Optimization: Streamline operations and reduce costs',
            'Data Analytics: Make informed business decisions',
            'Security & Compliance: Protect your business and customers',
            'Scalability: Solutions that grow with your business'
          ]
        },
        {
          type: 'text-image-left',
          title: 'Our Enterprise Approach',
          paragraphs: [
            "We understand the complexities of running an established business. Our approach focuses on minimizing disruption while maximizing the benefits of digital transformation.",
            "We provide comprehensive project management, thorough training, and ongoing support to ensure successful implementation and long-term success."
          ],
          image: '/images/work/project3.jpg'
        },
        {
          type: 'text-only',
          title: 'Expected Outcomes',
          paragraphs: [
            "Businesses that implement our comprehensive packages typically see significant improvements across all areas of their operations."
          ],
          list: [
            'Increased operational efficiency and reduced costs',
            'Enhanced customer experience and satisfaction',
            'Improved market position and competitive advantage',
            'Better data insights and decision-making capabilities',
            'Streamlined processes and improved productivity',
            'Future-ready technology infrastructure'
          ]
        }
      ],
    },
  };
  