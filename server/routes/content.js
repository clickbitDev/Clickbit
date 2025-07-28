const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// @desc    Get all published posts
// @route   GET /api/content/blog
// @access  Public
router.get('/blog', async (req, res) => {
  try {
    const posts = await Content.findAll({
      where: {
        content_type: 'post',
        status: 'published'
      },
      order: [['published_at', 'DESC']]
    });

    // Transform data to match frontend expectations
    const formattedPosts = posts.map(post => {
      // Parse custom_fields if it's a string to get the category
      let customFields = post.custom_fields;
      if (typeof customFields === 'string') {
        try {
          customFields = JSON.parse(customFields);
        } catch (err) {
          console.warn('Failed to parse custom_fields for post:', post.id);
          customFields = {};
        }
      }
      
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        published_at: post.published_at,
        metadata: {
          category: customFields?.category || post.categories?.[0] || 'General',
          featuredImage: post.featured_image || 'https://via.placeholder.com/600x400/1FBBD2/FFFFFF?text=Blog+Post'
        }
      };
    });

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return actual blog posts from static configuration
    const blogPosts = [
      {
        id: '1',
        title: 'The Future of Web Development: Trends to Watch in 2024',
        slug: 'future-web-development-trends-2024',
        excerpt: 'Discover the latest trends shaping the web development landscape in 2024, from AI-powered tools to advanced frameworks.',
        published_at: new Date('2024-01-15').toISOString(),
        metadata: {
          category: 'Web Development',
          featuredImage: '/images/work/project1.jpg'
        }
      },
      {
        id: '2',
        title: 'Building a Strong Brand Identity: A Complete Guide',
        slug: 'building-strong-brand-identity-guide',
        excerpt: 'Learn the essential elements of creating a compelling brand identity that resonates with your target audience.',
        published_at: new Date('2024-01-10').toISOString(),
        metadata: {
          category: 'Design & Branding',
          featuredImage: '/images/work/project2.jpg'
        }
      },
      {
        id: '3',
        title: 'Digital Marketing Strategies That Drive Results',
        slug: 'digital-marketing-strategies-results',
        excerpt: 'Explore proven digital marketing strategies that can help your business grow and reach new customers effectively.',
        published_at: new Date('2024-01-05').toISOString(),
        metadata: {
          category: 'Digital Marketing',
          featuredImage: '/images/work/project3.jpg'
        }
      },
      {
        id: '4',
        title: 'E-commerce Website Case Study: 300% Revenue Increase',
        slug: 'ecommerce-case-study-revenue-increase',
        excerpt: 'How we helped a local retailer achieve a 300% revenue increase through a complete e-commerce transformation.',
        published_at: new Date('2023-12-20').toISOString(),
        metadata: {
          category: 'Case Studies',
          featuredImage: '/images/work/project1.jpg'
        }
      },
      {
        id: '5',
        title: 'The Importance of UX in Web Design',
        slug: 'importance-of-ux-in-web-design',
        excerpt: 'An in-depth look at why User Experience (UX) is critical for the success of any website or digital product.',
        published_at: new Date('2023-12-15').toISOString(),
        metadata: {
          category: 'Design & Branding',
          featuredImage: '/images/work/project2.jpg'
        }
      },
      {
        id: '6',
        title: 'How to Choose the Right Tech Stack for Your Project',
        slug: 'how-to-choose-right-tech-stack',
        excerpt: 'A practical guide to selecting the best technology stack for your web or mobile application.',
        published_at: new Date('2023-12-10').toISOString(),
        metadata: {
          category: 'Technology',
          featuredImage: '/images/work/project3.jpg'
        }
      }
    ];
    
    res.json(blogPosts);
  }
});

// @desc    Get a single post by slug
// @route   GET /api/content/blog/:slug
// @access  Public
router.get('/blog/:slug', async (req, res) => {
    try {
      const post = await Content.findOne({
        where: {
          slug: req.params.slug,
          content_type: 'post',
          status: 'published'
        }
      });
      
      if (!post) {
        // Try to find in static blog posts
        const staticPosts = {
          'future-web-development-trends-2024': {
            id: 1,
            title: 'The Future of Web Development: Trends to Watch in 2024',
            slug: 'future-web-development-trends-2024',
            excerpt: 'Discover the latest trends shaping the web development landscape in 2024, from AI-powered tools to advanced frameworks.',
            content: `<h2>Introduction</h2>
<p>The web development landscape is constantly evolving, and 2024 promises to bring exciting changes. In this comprehensive guide, we'll explore the trends that are shaping the future of web development.</p>

<h2>1. AI-Powered Development Tools</h2>
<p>Artificial Intelligence is revolutionizing how we write code. From GitHub Copilot to ChatGPT, developers are leveraging AI to boost productivity and solve complex problems faster than ever before.</p>

<h2>2. WebAssembly Goes Mainstream</h2>
<p>WebAssembly (WASM) is breaking down the barriers between web and native applications. With improved performance and broader language support, WASM is enabling high-performance applications to run directly in the browser.</p>

<h2>3. Edge Computing and Serverless</h2>
<p>The rise of edge computing is bringing computation closer to users, resulting in faster response times and improved user experiences. Combined with serverless architectures, developers can build scalable applications without managing infrastructure.</p>

<h2>4. Progressive Web Apps (PWAs) Evolution</h2>
<p>PWAs continue to blur the line between web and mobile apps. With new APIs and improved capabilities, PWAs are becoming a viable alternative to native mobile applications for many use cases.</p>

<h2>5. Modern CSS and Design Systems</h2>
<p>CSS continues to evolve with features like Container Queries, Cascade Layers, and improved grid layouts. Design systems are becoming more sophisticated, enabling consistent user experiences across large applications.</p>

<h2>Conclusion</h2>
<p>Staying ahead in web development means embracing these trends while maintaining a focus on user experience and performance. The future is bright for developers willing to adapt and learn.</p>`,
            published_at: new Date('2024-01-15').toISOString(),
            metadata: {
              category: 'Web Development',
              tags: ['Web Development', 'AI', 'WebAssembly', 'PWA', 'Trends'],
              featuredImage: '/images/work/project1.jpg'
            }
          },
          'building-strong-brand-identity-guide': {
            id: 2,
            title: 'Building a Strong Brand Identity: A Complete Guide',
            slug: 'building-strong-brand-identity-guide',
            excerpt: 'Learn the essential elements of creating a compelling brand identity that resonates with your target audience.',
            content: `<h2>What is Brand Identity?</h2>
<p>Brand identity is the collection of all elements that a company creates to portray the right image to its consumer. It's what makes your business unique and memorable in the marketplace.</p>

<h2>Key Elements of Brand Identity</h2>
<h3>1. Logo Design</h3>
<p>Your logo is often the first thing people associate with your brand. It should be simple, memorable, and scalable across different mediums.</p>

<h3>2. Color Palette</h3>
<p>Colors evoke emotions and can significantly impact how your brand is perceived. Choose colors that align with your brand personality and values.</p>

<h3>3. Typography</h3>
<p>Consistent typography helps create a cohesive brand experience. Select fonts that reflect your brand's character and are readable across all platforms.</p>

<h3>4. Brand Voice</h3>
<p>How you communicate is just as important as what you communicate. Develop a consistent tone of voice that resonates with your target audience.</p>

<h3>5. Visual Style</h3>
<p>From photography to illustrations, your visual style should be consistent and aligned with your brand values.</p>

<h2>Building Your Brand Strategy</h2>
<p>A successful brand identity starts with a solid strategy. Define your mission, vision, values, and unique value proposition before diving into design.</p>

<h2>Conclusion</h2>
<p>Building a strong brand identity takes time and effort, but the investment pays off in customer recognition, loyalty, and business growth.</p>`,
            published_at: new Date('2024-01-10').toISOString(),
            metadata: {
              category: 'Design & Branding',
              tags: ['Branding', 'Design', 'Logo', 'Identity', 'Marketing'],
              featuredImage: '/images/work/project2.jpg'
            }
          }
        };
        
        const staticPost = staticPosts[req.params.slug];
        if (staticPost) {
          return res.json(staticPost);
        }
        
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Format the post data
      const formattedPost = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        published_at: post.published_at,
        metadata: {
          category: post.categories?.[0] || 'General',
          tags: post.categories || ['General'],
          featuredImage: post.featured_image || '/images/work/project1.jpg'
        }
      };
      
      res.json(formattedPost);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Error fetching post' });
    }
});

// @desc    Get all published portfolio items
// @route   GET /api/content/portfolio
// @access  Public
router.get('/portfolio', async (req, res) => {
    try {
      const items = await Content.findAll({
        where: {
          content_type: 'custom', // Matches the migration script
          status: 'published'
        },
        order: [['created_at', 'DESC']]
      });

      // Transform data to match frontend expectations
      const formattedItems = items.map(item => {
        // Parse custom_fields (not metadata) if it's a string
        let customFields = item.custom_fields;
        if (typeof customFields === 'string') {
          try {
            customFields = JSON.parse(customFields);
          } catch (err) {
            console.warn('Failed to parse custom_fields for item:', item.id);
            customFields = {};
          }
        }
        
        return {
          id: item.id,
          title: item.title,
          description: item.content, // 'content' field holds the description
          category: customFields?.category || 'General',
          image_url: customFields?.image_url || '/images/work/project1.jpg',
          live_url: customFields?.live_url,
          tags: customFields?.tags || []
        };
      });

      res.json(formattedItems);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      
      // Return actual portfolio data from static configuration
      const portfolioItems = [
        {
          id: 1,
          title: 'E-commerce Platform for Fashion Brand',
          category: 'Web Development',
          image_url: '/images/work/project1.jpg',
          description: 'A full-featured e-commerce platform with a custom CMS, and advanced filtering. Built with React, and Node.js.',
          tags: ['Web Development', 'React', 'E-commerce', 'UI/UX'],
        },
        {
          id: 2,
          title: 'Mobile Banking App',
          category: 'Mobile App Development',
          image_url: '/images/work/project2.jpg',
          description: 'A secure and intuitive mobile banking application for iOS and Android. Focused on user experience and security.',
          tags: ['Mobile App Development', 'UI/UX', 'FinTech'],
        },
        {
          id: 3,
          title: 'SaaS Platform for Project Management',
          category: 'Web Development',
          image_url: '/images/work/project3.jpg',
          description: 'A comprehensive SaaS platform for project management, including task tracking, team collaboration, and reporting features.',
          tags: ['Web Development', 'SaaS', 'React', 'UI/UX'],
        },
        {
          id: 4,
          title: 'Branding for a Tech Startup',
          category: 'Design & Branding',
          image_url: '/images/work/project1.jpg',
          description: 'A complete branding package for a new tech startup, including logo, brand guidelines, and marketing materials.',
          tags: ['Design & Branding', 'Logo Design', 'Identity'],
        },
        {
          id: 5,
          title: 'Cloud Migration for a Healthcare Provider',
          category: 'Infrastructure',
          image_url: '/images/work/project2.jpg',
          description: 'Migrated a healthcare provider\'s on-premise infrastructure to a secure and scalable AWS cloud environment.',
          tags: ['Infrastructure', 'Cloud', 'AWS', 'Security'],
        },
        {
          id: 6,
          title: 'AI-Powered Chatbot for Customer Service',
          category: 'Specialized Tech',
          image_url: '/images/work/project3.jpg',
          description: 'Developed an AI-powered chatbot to automate customer service inquiries, improving response times and customer satisfaction.',
          tags: ['Specialized Tech', 'AI', 'Chatbot', 'NLP'],
        },
        {
          id: 7,
          title: 'Corporate Website for a Law Firm',
          category: 'Web Development',
          image_url: '/images/work/project1.jpg',
          description: 'A professional and elegant website for a leading law firm, focusing on brand credibility and user trust.',
          tags: ['Web Development', 'Corporate', 'UI/UX'],
        },
        {
          id: 8,
          title: 'Custom CRM for a Real Estate Agency',
          category: 'Business Systems',
          image_url: '/images/work/project2.jpg',
          description: 'A bespoke CRM system to manage client relationships, property listings, and sales pipelines for a real estate agency.',
          tags: ['Business Systems', 'CRM', 'Real Estate'],
        },
        {
          id: 9,
          title: 'Digital Marketing Campaign for a Retail Brand',
          category: 'Marketing & Growth',
          image_url: '/images/work/project3.jpg',
          description: 'A multi-channel digital marketing campaign including SEO, PPC, and social media to boost online sales for a retail brand.',
          tags: ['Marketing & Growth', 'SEO', 'PPC', 'Social Media'],
        },
        {
          id: 10,
          title: 'UI/UX Redesign for a Healthcare App',
          category: 'Design & Branding',
          image_url: '/images/work/project1.jpg',
          description: 'A complete UI/UX redesign of a healthcare app to improve usability, accessibility, and patient engagement.',
          tags: ['Design & Branding', 'UI/UX', 'Healthcare'],
        },
        {
          id: 11,
          title: 'Managed IT Services for a Financial Firm',
          category: 'Infrastructure',
          image_url: '/images/work/project2.jpg',
          description: 'Provided comprehensive managed IT services, including network security, data backup, and 24/7 support for a financial firm.',
          tags: ['Infrastructure', 'Managed Services', 'Security'],
        },
        {
          id: 12,
          title: 'Data Analytics Dashboard for a Logistics Company',
          category: 'Specialized Tech',
          image_url: '/images/work/project3.jpg',
          description: 'Developed a data analytics dashboard to visualize key metrics and provide actionable insights for a logistics company.',
          tags: ['Specialized Tech', 'Data Analytics', 'BI'],
        },
      ];
      
      res.json(portfolioItems);
    }
});

// @desc    Create a comment on a blog post
// @route   POST /api/content/posts/:postId/comments
// @access  Public
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, email, content } = req.body;

    // Validate input
    if (!name || !email || !content) {
      return res.status(400).json({ message: 'Name, email, and comment content are required.' });
    }

    // Verify the post exists
    const post = await Content.findOne({
      where: {
        id: postId,
        content_type: 'post',
        status: 'published'
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create the comment
    const Comment = require('../models/Comment');
    const comment = await Comment.create({
      post_id: postId,
      author_name: name,
      author_email: email,
      content: content,
      status: 'pending', // Comments go to admin panel for approval
      user_id: null // Guest comment
    });

    // Comments are sent to admin panel for approval - no email sent
    res.status(201).json({ 
      message: 'Thank you for your comment! It will be reviewed by our team before publishing.',
      comment: {
        id: comment.id,
        author_name: comment.author_name,
        content: comment.content,
        created_at: comment.created_at
      }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

module.exports = router; 