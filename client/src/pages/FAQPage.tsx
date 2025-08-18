import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General Questions
  {
    question: "What services does ClickBit offer?",
    answer: "ClickBit offers comprehensive digital solutions including Custom Web Applications, Website Development, Mobile App Development, Infrastructure Services (Cloud Solutions, Network Design, Data Storage), Specialized Tech (AI/ML, Data Analytics), Business Systems (CRM, ERP, HRM, SCM), Design & Branding, Marketing & Growth services, and Business Packages (Startup, Small Business, Ultimate).",
    category: "General"
  },
  {
    question: "How long does it take to build a website or application?",
    answer: "Timelines vary by project complexity: Simple business websites (2-4 weeks), complex web applications (8-12 weeks), mobile apps (10-16 weeks), and enterprise solutions (12-20 weeks). We provide detailed timelines during consultation based on your specific requirements.",
    category: "General"
  },
  {
    question: "Do you provide ongoing support after project completion?",
    answer: "Yes, we offer comprehensive support packages including website maintenance, security updates, performance monitoring, content updates, and technical support. We provide 30 days of free support after project completion, with ongoing maintenance packages starting from $99/month.",
    category: "General"
  },

  // Pricing & Payment
  {
    question: "How much do your services cost?",
    answer: "Our pricing varies based on project scope and complexity. Basic websites start from $1,500, custom applications from $5,000, mobile apps from $8,000, and enterprise solutions from $15,000+. We offer transparent pricing and can customize packages to fit your budget and requirements.",
    category: "Pricing & Payment"
  },
  {
    question: "What payment terms do you offer?",
    answer: "We require a 50% deposit to begin work, with the remaining balance due upon project completion. For larger projects, we offer milestone-based payments. We accept bank transfers, online payments, and can arrange payment plans for enterprise clients.",
    category: "Pricing & Payment"
  },
  {
    question: "Do you offer maintenance packages?",
    answer: "Yes, we offer flexible maintenance packages starting from $99/month. These include regular updates, security monitoring, backups, performance optimization, content updates, and priority technical support. We can customize packages based on your specific needs.",
    category: "Pricing & Payment"
  },

  // Technical Questions
  {
    question: "What technologies do you use for development?",
    answer: "We use modern, industry-standard technologies including React, Next.js, Node.js, Python, PHP, WordPress, Shopify, and various databases. We choose the optimal technology stack based on your project requirements, scalability needs, and long-term goals.",
    category: "Technical"
  },
  {
    question: "Will my website be mobile-friendly and responsive?",
    answer: "Absolutely! All our websites are built with responsive design principles, ensuring perfect functionality across all devices including smartphones, tablets, and desktop computers. Mobile optimization is included in all our web development projects.",
    category: "Technical"
  },
  {
    question: "Do you provide hosting and domain services?",
    answer: "Yes, we offer reliable hosting solutions and domain management services. We partner with trusted hosting providers to ensure fast, secure, and reliable hosting for your website. We can also help with domain registration and management.",
    category: "Technical"
  },
  {
    question: "How do you ensure website security?",
    answer: "We implement comprehensive security measures including SSL certificates, regular security updates, secure coding practices, database protection, firewall configuration, and ongoing security monitoring. We also provide security training and best practices for your team.",
    category: "Technical"
  },

  // Process & Communication
  {
    question: "What is your development process?",
    answer: "Our process includes discovery and planning, design and prototyping, development and testing, content integration, quality assurance, and launch. We maintain regular communication throughout the project with weekly progress updates and milestone reviews.",
    category: "Process & Communication"
  },
  {
    question: "How do you handle project communication?",
    answer: "We use various communication tools including email, phone calls, video meetings, and project management platforms. You'll have a dedicated project manager as your main point of contact, with regular check-ins and progress reports throughout the development process.",
    category: "Process & Communication"
  },
  {
    question: "Can I make changes during development?",
    answer: "Yes, we understand that requirements can evolve. We build flexibility into our process to accommodate reasonable changes. Minor changes are included, while major changes that affect timeline or cost will require a change order and may result in additional fees.",
    category: "Process & Communication"
  },

  // SEO & Marketing
  {
    question: "Do you provide SEO and digital marketing services?",
    answer: "Yes, we offer comprehensive SEO and digital marketing services including keyword research, on-page optimization, technical SEO, content strategy, PPC campaigns, social media management, and ongoing SEO monitoring. We can also integrate with Google Analytics and other tracking tools.",
    category: "SEO & Marketing"
  },
  {
    question: "Will my website be optimized for search engines?",
    answer: "Yes, all our websites are built with SEO best practices in mind, including clean code structure, fast loading times, mobile optimization, proper meta tags, and semantic HTML. We can also provide ongoing SEO optimization services.",
    category: "SEO & Marketing"
  },
  {
    question: "What digital marketing services do you offer?",
    answer: "We provide comprehensive digital marketing services including strategic planning, SEO optimization, PPC advertising, social media management, content marketing, email marketing, conversion rate optimization, and analytics reporting.",
    category: "SEO & Marketing"
  },

  // Infrastructure & Cloud
  {
    question: "Do you provide cloud migration services?",
    answer: "Yes, we specialize in cloud migration and infrastructure services including AWS, Azure, and Google Cloud Platform. We handle migration planning, implementation, testing, and ongoing management to ensure smooth transitions and optimal performance.",
    category: "Infrastructure & Cloud"
  },
  {
    question: "What infrastructure services do you offer?",
    answer: "We offer comprehensive infrastructure services including managed server solutions, cloud migration, network design, data storage solutions, software integration, and ongoing maintenance and support for all digital infrastructure components.",
    category: "Infrastructure & Cloud"
  },
  {
    question: "Do you provide AI and machine learning solutions?",
    answer: "Yes, we offer AI and machine learning solutions for data analysis, predictive modeling, automation, and business intelligence. We can develop custom AI solutions tailored to your specific business needs and data requirements.",
    category: "Infrastructure & Cloud"
  },

  // Business Systems
  {
    question: "Do you implement business systems like CRM and ERP?",
    answer: "Yes, we specialize in implementing and customizing business systems including CRM, ERP, HRM, and SCM solutions. We work with leading platforms and can develop custom integrations to streamline your business processes.",
    category: "Business Systems"
  },
  {
    question: "What business packages do you offer?",
    answer: "We offer three main business packages: Startup Package for new businesses, Small Business Package for growing companies, and Ultimate Package for established market leaders. Each package includes a curated selection of services tailored to different business stages and needs.",
    category: "Business Systems"
  },
  {
    question: "Do you provide data analytics and management services?",
    answer: "Yes, we offer comprehensive data management and analytics services to turn your raw data into actionable insights. This includes data collection, analysis, visualization, and reporting to help you make informed business decisions.",
    category: "Business Systems"
  }
];

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <PageHeader 
        title="Frequently Asked Questions"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'FAQ', href: '/faq' }
        ]}
      />
      
      <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-[#1FBBD2] text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {item.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-[#1FBBD2] to-[#F39C12] p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Can't find the answer you're looking for? We're here to help!
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-white text-[#1FBBD2] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQPage;