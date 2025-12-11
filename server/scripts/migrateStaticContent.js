const { connectDatabase } = require('../config/database');
const { Content, User } = require('../models');

// We are copying the data here because the server (CommonJS) can't easily import from the client (ESM/TypeScript).
const blogPosts = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2024',
      slug: 'future-web-development-trends-2024',
      excerpt: 'Discover the latest trends shaping the web development landscape in 2024, from AI-powered tools to advanced frameworks.',
      content: `
        <p>The web development landscape is constantly evolving, and 2024 brings exciting new trends that will shape how we build digital experiences. From AI-powered development tools to advanced frameworks, let's explore what's on the horizon.</p>
        <h2>AI-Powered Development Tools</h2>
        <p>Artificial Intelligence is revolutionizing how developers write code. Tools like GitHub Copilot and similar AI assistants are becoming indispensable for modern development teams. These tools can:</p>
        <ul>
          <li>Generate boilerplate code automatically</li>
          <li>Suggest optimizations and best practices</li>
          <li>Help with debugging and error resolution</li>
          <li>Provide intelligent code completion</li>
        </ul>
        <h2>Advanced JavaScript Frameworks</h2>
        <p>Frameworks like Next.js 14, React 18, and Vue 3 are pushing the boundaries of what's possible in web development. Server components, improved performance, and better developer experience are just the beginning.</p>
        <h2>Web Performance Optimization</h2>
        <p>With Core Web Vitals becoming crucial for SEO, performance optimization is more important than ever. Techniques like:</p>
        <ul>
          <li>Image optimization and modern formats</li>
          <li>Code splitting and lazy loading</li>
          <li>Server-side rendering and static generation</li>
          <li>CDN optimization</li>
        </ul>
        <p>These trends are not just passing fads—they represent fundamental shifts in how we approach web development. Staying ahead of these trends will be crucial for developers and businesses alike.</p>
      `,
      category: 'Web Development',
      tags: ['Web Development', 'AI', 'JavaScript', 'Performance'],
      featuredImage: '/images/work/project1.jpg',
    },
    {
      id: '2',
      title: 'Building a Strong Brand Identity: A Complete Guide',
      slug: 'building-strong-brand-identity-guide',
      excerpt: 'Learn the essential elements of creating a compelling brand identity that resonates with your target audience.',
      content: `
        <p>A strong brand identity is the foundation of any successful business. It's more than just a logo—it's the complete visual and emotional experience your customers have with your company.</p>
        <h2>Understanding Brand Identity</h2>
        <p>Brand identity encompasses everything from your logo and color palette to your tone of voice and customer service approach. It's what makes your business memorable and trustworthy.</p>
        <h2>Key Elements of Brand Identity</h2>
        <ul>
          <li><strong>Logo Design:</strong> Your visual signature</li>
          <li><strong>Color Palette:</strong> Emotional connection through colors</li>
          <li><strong>Typography:</strong> Personality through fonts</li>
          <li><strong>Brand Voice:</strong> How you communicate</li>
          <li><strong>Visual Style:</strong> Consistent design language</li>
        </ul>
        <h2>Steps to Build Your Brand Identity</h2>
        <p>Creating a strong brand identity requires careful planning and execution:</p>
        <ol>
          <li>Define your brand values and mission</li>
          <li>Research your target audience</li>
          <li>Analyze your competition</li>
          <li>Design your visual elements</li>
          <li>Create brand guidelines</li>
          <li>Implement consistently across all touchpoints</li>
        </ol>
        <p>Remember, building a brand identity is an ongoing process that evolves with your business and market changes.</p>
      `,
      category: 'Design & Branding',
      tags: ['Branding', 'Design', 'Marketing', 'Identity'],
      featuredImage: '/images/work/project2.jpg',
    },
    {
        id: '3',
        title: 'Digital Marketing Strategies That Drive Results',
        slug: 'digital-marketing-strategies-results',
        excerpt: 'Explore proven digital marketing strategies that can help your business grow and reach new customers effectively.',
        content: `
          <p>In today's digital-first world, having a solid digital marketing strategy is essential for business growth. Let's explore the most effective approaches that deliver real results.</p>
          <h2>Content Marketing</h2>
          <p>Content is still king in digital marketing. High-quality, valuable content helps you:</p>
          <ul>
            <li>Establish authority in your industry</li>
            <li>Improve search engine rankings</li>
            <li>Build trust with your audience</li>
            <li>Generate qualified leads</li>
          </ul>
          <h2>Social Media Marketing</h2>
          <p>Social media platforms offer unprecedented access to your target audience. The key is to:</p>
          <ul>
            <li>Choose the right platforms for your audience</li>
            <li>Create engaging, shareable content</li>
            <li>Build genuine relationships with followers</li>
            <li>Use paid advertising strategically</li>
          </ul>
          <h2>Email Marketing</h2>
          <p>Despite new channels emerging, email marketing remains one of the most effective digital marketing tools. Focus on:</p>
          <ul>
            <li>Building a quality email list</li>
            <li>Personalizing your messages</li>
            <li>Creating compelling subject lines</li>
            <li>Testing and optimizing campaigns</li>
          </ul>
          <p>The most successful digital marketing strategies combine multiple channels and tactics, always keeping the customer experience at the center.</p>
        `,
        category: 'Digital Marketing',
        tags: ['Digital Marketing', 'Content Marketing', 'Social Media', 'Email Marketing'],
        featuredImage: '/images/work/project3.jpg',
      },
      {
        id: '4',
        title: 'E-commerce Website Case Study: 300% Revenue Increase',
        slug: 'ecommerce-case-study-revenue-increase',
        excerpt: 'How we helped a local retailer achieve a 300% revenue increase through a complete e-commerce transformation.',
        content: `
          <p>This case study demonstrates how strategic web development and digital marketing can transform a traditional business into a thriving online enterprise.</p>
          <h2>The Challenge</h2>
          <p>Our client, a local fashion retailer, was struggling with:</p>
          <ul>
            <li>Limited online presence</li>
            <li>Poor website user experience</li>
            <li>Low conversion rates</li>
            <li>Difficulty reaching new customers</li>
          </ul>
          <h2>Our Solution</h2>
          <p>We implemented a comprehensive digital transformation:</p>
          <ol>
            <li><strong>Modern E-commerce Platform:</strong> Built a custom Shopify store with advanced features</li>
            <li><strong>User Experience Optimization:</strong> Redesigned the entire customer journey</li>
            <li><strong>Mobile-First Design:</strong> Ensured perfect mobile experience</li>
            <li><strong>SEO Optimization:</strong> Improved search engine visibility</li>
            <li><strong>Digital Marketing Campaign:</strong> Launched targeted advertising campaigns</li>
          </ol>
          <h2>The Results</h2>
          <p>After 6 months of implementation:</p>
          <ul>
            <li>300% increase in online revenue</li>
            <li>150% increase in website traffic</li>
            <li>45% improvement in conversion rate</li>
          </ul>
        `,
        category: 'Case Studies',
        tags: ['E-commerce', 'Case Study', 'Web Development', 'Revenue'],
        featuredImage: '/images/work/project1.jpg',
      },
      {
        id: '5',
        title: 'The Importance of UX in Web Design',
        slug: 'importance-of-ux-in-web-design',
        excerpt: 'An in-depth look at why User Experience (UX) is critical for the success of any website or digital product.',
        content: `
          <p>User Experience (UX) is a critical component of web design that directly impacts customer satisfaction and business success. It's about creating a seamless, intuitive, and enjoyable interaction for your users.</p>
          <h2>What is UX?</h2>
          <p>UX goes beyond just the visual design. It encompasses:</p>
          <ul>
            <li><strong>Usability:</strong> How easy is it for users to accomplish their goals?</li>
            <li><strong>Accessibility:</strong> Can people with disabilities use your site?</li>
            <li><strong>Performance:</strong> How fast does your site load and respond?</li>
            <li><strong>Desirability:</strong> Is the design emotionally engaging?</li>
          </ul>
          <h2>Why UX Matters</h2>
          <p>Investing in UX can lead to significant ROI:</p>
          <ul>
            <li>Increased conversion rates</li>
            <li>Improved customer loyalty and retention</li>
            <li>Enhanced brand reputation</li>
            <li>Reduced development costs by fixing issues early</li>
          </ul>
        `,
        category: 'Design & Branding',
        tags: ['UX', 'Web Design', 'Usability', 'Accessibility'],
        featuredImage: '/images/work/project2.jpg',
      },
      {
        id: '6',
        title: 'How to Choose the Right Tech Stack for Your Project',
        slug: 'how-to-choose-right-tech-stack',
        excerpt: 'A practical guide to selecting the best technology stack for your web or mobile application.',
        content: `
          <p>Choosing the right technology stack is one of the most critical decisions for any new project. The right stack ensures scalability, performance, and maintainability.</p>
          <h2>Key Considerations</h2>
          <ul>
            <li><strong>Project Requirements:</strong> What are the core features and complexity?</li>
            <li><strong>Scalability:</strong> How will the application handle growth?</li>
            <li><strong>Team Expertise:</strong> What technologies does your team know best?</li>
            <li><strong>Cost:</strong> What are the licensing and operational costs?</li>
            <li><strong>Ecosystem & Community:</strong> How strong is the support and ecosystem around the technology?</li>
          </ul>
        `,
        category: 'Technology',
        tags: ['Tech Stack', 'Web Development', 'Architecture', 'Scalability'],
        featuredImage: '/images/work/project3.jpg',
      },
  ];

const portfolioItems = [
    {
      id: 1,
      title: 'E-commerce Platform for Fashion Brand',
      category: 'Web Development',
      image: '/images/work/project1.jpg',
      description: 'A full-featured e-commerce platform with a custom CMS, and advanced filtering. Built with React, and Node.js.',
      tags: ['Web Development', 'React', 'E-commerce', 'UI/UX'],
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'Mobile App Development',
      image: '/images/work/project2.jpg',
      description: 'A secure and intuitive mobile banking application for iOS and Android. Focused on user experience and security.',
      tags: ['Mobile App Development', 'UI/UX', 'FinTech'],
    },
    {
      id: 3,
      title: 'SaaS Platform for Project Management',
      category: 'Web Development',
      image: '/images/work/project3.jpg',
      description: 'A comprehensive SaaS platform for project management, including task tracking, team collaboration, and reporting features.',
      tags: ['Web Development', 'SaaS', 'React', 'UI/UX'],
    },
    {
      id: 4,
      title: 'Branding for a Tech Startup',
      category: 'Design & Branding',
      image: '/images/work/project1.jpg',
      description: 'A complete branding package for a new tech startup, including logo, brand guidelines, and marketing materials.',
      tags: ['Design & Branding', 'Logo Design', 'Identity'],
    },
    {
      id: 5,
      title: 'Cloud Migration for a Healthcare Provider',
      category: 'Infrastructure',
      image: '/images/work/project2.jpg',
      description: 'Migrated a healthcare provider\'s on-premise infrastructure to a secure and scalable AWS cloud environment.',
      tags: ['Infrastructure', 'Cloud', 'AWS', 'Security'],
    },
    {
      id: 6,
      title: 'AI-Powered Chatbot for Customer Service',
      category: 'Specialized Tech',
      image: '/images/work/project3.jpg',
      description: 'Developed an AI-powered chatbot to automate customer service inquiries, improving response times and customer satisfaction.',
      tags: ['Specialized Tech', 'AI', 'Chatbot', 'NLP'],
    },
    {
      id: 7,
      title: 'Corporate Website for a Law Firm',
      category: 'Web Development',
      image: '/images/work/project1.jpg',
      description: 'A professional and elegant website for a leading law firm, focusing on brand credibility and user trust.',
      tags: ['Web Development', 'Corporate', 'UI/UX'],
    },
    {
      id: 8,
      title: 'Custom CRM for a Real Estate Agency',
      category: 'Business Systems',
      image: '/images/work/project2.jpg',
      description: 'A bespoke CRM system to manage client relationships, property listings, and sales pipelines for a real estate agency.',
      tags: ['Business Systems', 'CRM', 'Real Estate'],
    },
    {
      id: 9,
      title: 'Digital Marketing Campaign for a Retail Brand',
      category: 'Marketing & Growth',
      image: '/images/work/project3.jpg',
      description: 'A multi-channel digital marketing campaign including SEO, PPC, and social media to boost online sales for a retail brand.',
      tags: ['Marketing & Growth', 'SEO', 'PPC', 'Social Media'],
    },
    {
      id: 10,
      title: 'UI/UX Redesign for a Healthcare App',
      category: 'Design & Branding',
      image: '/images/work/project1.jpg',
      description: 'A complete UI/UX redesign of a healthcare app to improve usability, accessibility, and patient engagement.',
      tags: ['Design & Branding', 'UI/UX', 'Healthcare'],
    },
    {
      id: 11,
      title: 'Managed IT Services for a Financial Firm',
      category: 'Infrastructure',
      image: '/images/work/project2.jpg',
      description: 'Provided comprehensive managed IT services, including network security, data backup, and 24/7 support for a financial firm.',
      tags: ['Infrastructure', 'Managed Services', 'Security'],
    },
    {
      id: 12,
      title: 'Data Analytics Dashboard for a Logistics Company',
      category: 'Specialized Tech',
      image: '/images/work/project3.jpg',
      description: 'Developed a data analytics dashboard to visualize key metrics and provide actionable insights for a logistics company.',
      tags: ['Specialized Tech', 'Data Analytics', 'BI'],
    },
  ];
  

const migrate = async () => {
  try {
    await connectDatabase();
    console.log('Database connected.');

    // Find an admin user to associate the content with
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.error('Migration failed: Could not find an admin user.');
      console.error('Please create an admin user first.');
      return;
    }
    console.log(`Found admin user: ${adminUser.email}`);

    // Migrate Blog Posts
    let blogPostsCreated = 0;
    for (const post of blogPosts) {
      const [dbPost, created] = await Content.findOrCreate({
        where: { slug: post.slug, content_type: 'post' },
        defaults: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          content_type: 'post',
          status: 'published',
          author_id: adminUser.id,
          // Storing tags and category in metadata
          metadata: {
            tags: post.tags,
            category: post.category,
            featuredImage: post.featuredImage,
            static_id: post.id
          }
        }
      });

      if (created) {
        blogPostsCreated++;
        console.log(`Created blog post: "${post.title}"`);
      }
    }
    console.log(`\nFinished migrating blog posts. ${blogPostsCreated} new posts created.`);
    
    // Migrate Portfolio Items
    let portfolioItemsCreated = 0;
    for (const item of portfolioItems) {
      const slug = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      const [dbItem, created] = await Content.findOrCreate({
        where: { slug: slug, content_type: 'custom' },
        defaults: {
          title: item.title,
          slug: slug,
          content: item.description,
          content_type: 'custom',
          status: 'published',
          author_id: adminUser.id,
          metadata: {
            category: item.category,
            image: item.image,
            tags: item.tags,
            liveUrl: item.liveUrl,
            caseStudyUrl: item.caseStudyUrl,
            static_id: item.id
          }
        }
      });
      if(created){
        portfolioItemsCreated++;
        console.log(`Created portfolio item: "${item.title}"`);
      }
    }
    console.log(`\nFinished migrating portfolio items. ${portfolioItemsCreated} new items created.`);


  } catch (error) {
    console.error('An error occurred during migration:', error);
  } finally {
    console.log('\nMigration script finished.');
    // Close the database connection if the script is run directly
    process.exit(0);
  }
};

migrate(); 