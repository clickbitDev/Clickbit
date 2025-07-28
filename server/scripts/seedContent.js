const { sequelize } = require('../config/database');
const Content = require('../models/Content');
const User = require('../models/User');

const seedContent = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Find the first admin user to use as author
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    // Sample blog posts
    const blogPosts = [
      {
        title: 'Getting Started with Web Development',
        slug: 'getting-started-web-development',
        content: `# Getting Started with Web Development

Web development is an exciting journey that opens up countless opportunities in the digital world. Whether you're looking to build websites, web applications, or pursue a career in tech, understanding the fundamentals is crucial.

## What You'll Learn

- HTML basics and structure
- CSS styling and layout
- JavaScript fundamentals
- Modern development tools
- Best practices and workflows

## Getting Started

The best way to start is by building small projects and gradually increasing complexity. Practice regularly and stay updated with the latest technologies and trends in web development.

Remember, every expert was once a beginner. Start coding today!`,
        content_type: 'post',
        status: 'published',
        author_id: adminUser.id,
        excerpt: 'Learn the fundamentals of web development and start your journey in creating amazing websites and applications.',
        meta_description: 'Complete guide to getting started with web development, including HTML, CSS, JavaScript, and modern tools.',
        tags: ['web development', 'beginners', 'programming', 'coding']
      },
      {
        title: 'The Future of E-commerce',
        slug: 'future-of-ecommerce',
        content: `# The Future of E-commerce

E-commerce has evolved dramatically over the past decade, and the future looks even more promising. From AI-powered recommendations to virtual reality shopping experiences, the landscape is constantly changing.

## Key Trends

### 1. Artificial Intelligence
AI is revolutionizing how customers discover and purchase products. Personalized recommendations, chatbots, and predictive analytics are becoming standard features.

### 2. Mobile Commerce
With mobile devices dominating internet usage, mobile-first design and seamless mobile experiences are essential for success.

### 3. Voice Commerce
Voice assistants and smart speakers are creating new shopping channels that require innovative approaches to product discovery and purchasing.

## What This Means for Businesses

Businesses need to adapt quickly to these changes. Investing in modern technology, focusing on user experience, and staying ahead of trends will be crucial for success in the evolving e-commerce landscape.`,
        content_type: 'post',
        status: 'published',
        author_id: adminUser.id,
        excerpt: 'Explore the latest trends and technologies shaping the future of e-commerce and online retail.',
        meta_description: 'Discover the future of e-commerce with AI, mobile commerce, voice shopping, and emerging technologies.',
        tags: ['ecommerce', 'technology', 'AI', 'mobile commerce', 'future']
      },
      {
        title: 'Building Scalable Web Applications',
        slug: 'building-scalable-web-applications',
        content: `# Building Scalable Web Applications

Scalability is a critical consideration when building web applications that need to handle growth and increased user load. Proper architecture and design patterns can make the difference between success and failure.

## Architecture Principles

### Microservices
Breaking down applications into smaller, independent services allows for better scalability, maintenance, and deployment flexibility.

### Database Design
Choosing the right database and designing efficient schemas is crucial for performance and scalability.

### Caching Strategies
Implementing proper caching at multiple levels can dramatically improve application performance and reduce server load.

## Best Practices

1. **Start with a solid foundation** - Choose the right technology stack
2. **Plan for growth** - Design with scalability in mind from the beginning
3. **Monitor and optimize** - Continuously monitor performance and optimize bottlenecks
4. **Use cloud services** - Leverage cloud infrastructure for automatic scaling

Building scalable applications requires careful planning and ongoing optimization, but the results are worth the effort.`,
        content_type: 'post',
        status: 'draft',
        author_id: adminUser.id,
        excerpt: 'Learn the principles and best practices for building web applications that can scale with your business growth.',
        meta_description: 'Comprehensive guide to building scalable web applications with proper architecture and design patterns.',
        tags: ['scalability', 'architecture', 'web applications', 'performance', 'microservices']
      }
    ];

    // Sample portfolio items
    const portfolioItems = [
      {
        title: 'E-commerce Platform Redesign',
        slug: 'ecommerce-platform-redesign',
        content: `# E-commerce Platform Redesign

A complete redesign and modernization of an existing e-commerce platform, improving user experience, performance, and conversion rates.

## Project Overview

This project involved redesigning a legacy e-commerce platform to meet modern standards and user expectations. The goal was to improve the overall user experience while maintaining all existing functionality.

## Key Features

- **Modern UI/UX Design** - Clean, intuitive interface following current design trends
- **Mobile-First Approach** - Responsive design optimized for all devices
- **Performance Optimization** - Improved loading times and overall performance
- **Enhanced Search** - Advanced search functionality with filters and recommendations
- **Payment Integration** - Secure payment processing with multiple payment options

## Technologies Used

- React.js for frontend
- Node.js and Express for backend
- MongoDB for database
- AWS for hosting and services
- Stripe for payment processing

## Results

- 40% improvement in page load times
- 25% increase in conversion rates
- 60% reduction in cart abandonment
- Improved mobile user engagement`,
        content_type: 'custom',
        status: 'published',
        author_id: adminUser.id,
        excerpt: 'Complete redesign of an e-commerce platform resulting in improved performance and user experience.',
        meta_description: 'E-commerce platform redesign project showcasing modern web development and UX improvements.',
        tags: ['ecommerce', 'redesign', 'UX/UI', 'performance', 'React']
      },
      {
        title: 'Corporate Website Development',
        slug: 'corporate-website-development',
        content: `# Corporate Website Development

A modern, professional website for a growing technology company, designed to showcase their services and attract new clients.

## Project Scope

Developed a comprehensive corporate website that effectively communicates the company's value proposition and services to potential clients and partners.

## Features Implemented

- **Professional Design** - Clean, modern design reflecting the company's brand
- **Service Showcase** - Detailed presentation of company services and capabilities
- **Team Profiles** - Professional team member profiles and expertise
- **Contact Integration** - Multiple contact methods and lead generation forms
- **Blog Section** - Content marketing platform for industry insights
- **SEO Optimization** - Search engine optimization for better visibility

## Technical Implementation

- Next.js for frontend framework
- Contentful CMS for content management
- Vercel for hosting and deployment
- Google Analytics for tracking
- Contact form integration

## Outcomes

- Increased organic traffic by 150%
- Generated 30+ qualified leads in first month
- Improved brand perception and professionalism
- Enhanced online presence and credibility`,
        content_type: 'custom',
        status: 'published',
        author_id: adminUser.id,
        excerpt: 'Professional corporate website development project with modern design and comprehensive features.',
        meta_description: 'Corporate website development showcasing modern web technologies and professional design.',
        tags: ['corporate', 'website', 'Next.js', 'CMS', 'SEO']
      }
    ];

    // Create blog posts
    console.log('Creating blog posts...');
    for (const post of blogPosts) {
      const existingPost = await Content.findOne({ where: { slug: post.slug } });
      if (!existingPost) {
        await Content.create(post);
        console.log(`Created blog post: ${post.title}`);
      } else {
        console.log(`Blog post already exists: ${post.title}`);
      }
    }

    // Create portfolio items
    console.log('Creating portfolio items...');
    for (const item of portfolioItems) {
      const existingItem = await Content.findOne({ where: { slug: item.slug } });
      if (!existingItem) {
        await Content.create(item);
        console.log(`Created portfolio item: ${item.title}`);
      } else {
        console.log(`Portfolio item already exists: ${item.title}`);
      }
    }

    console.log('Content seeding completed successfully!');
    
    // Show summary
    const totalPosts = await Content.count({ where: { content_type: ['post', 'article', 'news'] } });
    const totalPortfolio = await Content.count({ where: { content_type: 'custom' } });
    
    console.log(`\nSummary:`);
    console.log(`- Total blog posts: ${totalPosts}`);
    console.log(`- Total portfolio items: ${totalPortfolio}`);

  } catch (error) {
    console.error('Error seeding content:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seeding
seedContent(); 