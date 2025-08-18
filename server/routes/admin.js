const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { User, Content, BlogPost, PortfolioItem, SiteSetting, Contact, Analytics, Service, Team, Comment, Order, OrderItem } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const blogScheduler = require('../services/blogScheduler');

// @desc    Get admin-only data (test route)
// @route   GET /api/admin/data
// @access  Private/Admin
router.get(
  '/data',
  protect,
  authorize('dashboard:view'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'You have accessed the admin-only route!',
      user: {
        id: req.user.id,
        name: req.user.getFullName(),
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
router.get(
  '/dashboard/stats',
  protect,
  authorize('dashboard:view'),
  async (req, res) => {
    try {
      // Get counts with proper error handling for each model
      const [
        totalUsers,
        totalBlogPosts,
        totalPortfolioItems,
        totalComments,
        pendingComments,
        totalContacts,
        totalServices,
        totalTeamMembers
      ] = await Promise.allSettled([
        User.count(),
        BlogPost.count(),
        PortfolioItem.count(),
        Comment.count().catch(() => 0), // If comments table doesn't exist, default to 0
        Comment.count({ where: { status: 'pending' } }).catch(() => 0),
        Contact.count(),
        Service.count(),
        Team.count()
      ]);

      // Extract values from settled promises with fallbacks
      const stats = {
        totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value : 0,
        totalBlogPosts: totalBlogPosts.status === 'fulfilled' ? totalBlogPosts.value : 0,
        totalPortfolioItems: totalPortfolioItems.status === 'fulfilled' ? totalPortfolioItems.value : 0,
        totalComments: totalComments.status === 'fulfilled' ? totalComments.value : 0,
        pendingComments: pendingComments.status === 'fulfilled' ? pendingComments.value : 0,
        totalContacts: totalContacts.status === 'fulfilled' ? totalContacts.value : 0,
        totalServices: totalServices.status === 'fulfilled' ? totalServices.value : 0,
        totalTeamMembers: totalTeamMembers.status === 'fulfilled' ? totalTeamMembers.value : 0
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ 
        message: 'Error fetching dashboard statistics', 
        error: error.message,
        // Return default stats on error
        totalUsers: 0,
        totalBlogPosts: 0,
        totalPortfolioItems: 0,
        totalComments: 0,
        pendingComments: 0,
        totalContacts: 0,
        totalServices: 0,
        totalTeamMembers: 0
      });
    }
  }
);

// @desc    Get all pending comments
// @route   GET /api/admin/comments/pending
// @access  Private/Admin
router.get(
  '/comments/pending',
  protect,
  authorize('reviews:list'),
  async (req, res) => {
    try {
      const pendingComments = await Comment.findAll({
        where: { status: 'pending' },
        include: [
          {
            model: BlogPost,
            as: 'blogPost',
            attributes: ['title'],
            required: false
          },
          {
            model: PortfolioItem,
            as: 'portfolioItem', 
            attributes: ['title'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']],
      });
      res.status(200).json(pendingComments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending comments', error: error.message });
    }
  }
);

// @desc    Update comment status
// @route   PUT /api/admin/comments/:id/status
// @access  Private/Admin
router.put(
  '/comments/:id/status',
  protect,
  authorize('reviews:update'),
  async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
      const comment = await Comment.findByPk(id);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }

      comment.status = status;
      await comment.save();

      res.status(200).json({ message: `Comment ${status}.`, comment });
    } catch (error) {
      res.status(500).json({ message: 'Error updating comment status', error: error.message });
    }
  }
);

// --- Blog Post Management ---

// @desc    Get all blog posts
// @route   GET /api/admin/posts
// @access  Private/Admin
router.get(
  '/posts',
  protect,
  authorize('content:list'),
  async (req, res) => {
    try {
      const posts = await BlogPost.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        order: [['created_at', 'DESC']],
      });

      // Transform the data to match frontend expectations
      const transformedPosts = posts.map(post => {
        // Parse categories if it's a string
        let categories = post.categories;
        if (typeof categories === 'string') {
          try {
            categories = JSON.parse(categories);
          } catch (err) {
            console.warn('Failed to parse categories for post:', post.id);
            categories = [];
          }
        }
        
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          status: post.status,
          author: post.author ? `${post.author.first_name} ${post.author.last_name}` : 'Unknown',
          category: categories && categories.length > 0 ? categories[0] : 'General',
          cover_image: post.featured_image,
          featured_image: post.featured_image,
          created_at: post.created_at,
          updated_at: post.updated_at,
          published_at: post.published_at
        };
      });

      res.status(200).json(transformedPosts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
    }
  }
);

// @desc    Get single blog post
// @route   GET /api/admin/posts/:id
// @access  Private/Admin
router.get(
  '/posts/:id',
  protect,
  authorize('content:view'),
  async (req, res) => {
    try {
      const post = await BlogPost.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Parse categories if it's a string
      let categories = post.categories;
      if (typeof categories === 'string') {
        try {
          categories = JSON.parse(categories);
        } catch (err) {
          console.warn('Failed to parse categories for post:', post.id);
          categories = [];
        }
      }
      
      const transformedPost = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        author: post.author ? `${post.author.first_name} ${post.author.last_name}` : 'Unknown',
        category: categories && categories.length > 0 ? categories[0] : 'General',
        cover_image: post.featured_image,
        featured_image: post.featured_image,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
        scheduled_at: post.scheduled_at
      };

      res.status(200).json(transformedPost);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog post', error: error.message });
    }
  }
);

// @desc    Create a new blog post
// @route   POST /api/admin/posts
// @access  Private/Admin
router.post(
  '/posts',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { title, content, slug, status, author_id, category, excerpt, tags, featured_image, scheduled_at } = req.body;
      console.log('Blog post CREATE - featured_image received:', featured_image);
      console.log('Blog post CREATE - scheduled_at received:', scheduled_at);
      
      if (!title || !content || !category) {
        return res.status(400).json({ message: 'Title, content, and category are required.' });
      }

      // Validate scheduled_at if status is 'scheduled'
      if (status === 'scheduled') {
        if (!scheduled_at) {
          return res.status(400).json({ message: 'Scheduled date is required for scheduled posts.' });
        }
        const scheduledDate = new Date(scheduled_at);
        if (scheduledDate <= new Date()) {
          return res.status(400).json({ message: 'Scheduled date must be in the future.' });
        }
      }

      const postSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      const newPost = await BlogPost.create({
        title,
        content,
        slug: postSlug,
        status: status || 'published',
        author_id: req.user.id, // Always use the logged-in user
        excerpt,
        featured_image,
        tags: tags || [],
        categories: category ? [category] : [],
        published_at: status === 'published' ? new Date() : null,
        scheduled_at: status === 'scheduled' ? new Date(scheduled_at) : null
      });
      
      console.log('Created blog post with featured_image:', newPost.featured_image);
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Error creating blog post', error: error.message });
    }
  }
);

// @desc    Update a blog post
// @route   PUT /api/admin/posts/:id
// @access  Private/Admin
router.put(
  '/posts/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const post = await BlogPost.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const { title, content, slug, status, category, excerpt, tags, featured_image, scheduled_at } = req.body;
      console.log('Blog post UPDATE - featured_image received:', featured_image);
      console.log('Blog post UPDATE - scheduled_at received:', scheduled_at);
      
      if (!title || !content || !category) {
        return res.status(400).json({ message: 'Title, content, and category are required.' });
      }

      // Validate scheduled_at if status is 'scheduled'
      if (status === 'scheduled') {
        if (!scheduled_at) {
          return res.status(400).json({ message: 'Scheduled date is required for scheduled posts.' });
        }
        const scheduledDate = new Date(scheduled_at);
        if (scheduledDate <= new Date()) {
          return res.status(400).json({ message: 'Scheduled date must be in the future.' });
        }
      }
      
      const postSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      const updatedData = {
        title,
        content,
        slug: postSlug,
        status: status || 'published',
        excerpt,
        featured_image,
        tags: tags || [],
        categories: category ? [category] : [],
        published_at: status === 'published' && post.status !== 'published' ? new Date() : post.published_at,
        scheduled_at: status === 'scheduled' ? new Date(scheduled_at) : null
      };

      await post.update(updatedData);
      console.log('Updated blog post with featured_image:', post.featured_image);
      res.status(200).json(post);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Error updating blog post', error: error.message });
    }
  }
);

// @desc    Update blog post status
// @route   PATCH /api/admin/posts/:id
// @access  Private/Admin
router.patch(
  '/posts/:id',
  protect,
  authorize('content:update'),
  async (req, res) => {
    try {
      const post = await BlogPost.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      await post.update(req.body);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error updating blog post', error: error.message });
    }
  }
);

// @desc    Delete a blog post
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
router.delete(
  '/posts/:id',
  protect,
  authorize('content:delete'),
  async (req, res) => {
    try {
      const post = await BlogPost.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      await post.destroy();
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting blog post', error: error.message });
    }
  }
);

// --- Portfolio Item Management ---

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
router.get(
  '/categories',
  protect,
  authorize('content:list'),
  async (req, res) => {
    try {
      // Get categories from the database table
      const Category = require('../models/Category');
      const categories = await Category.findAll({
        where: { status: 'active' },
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        attributes: ['id', 'name', 'slug', 'description']
      });

      res.status(200).json(categories);
    } catch (error) {
      console.error('Categories fetch error:', error);
      // Return fallback categories on error
      const fallbackCategories = [
        { id: 1, name: 'Design & Branding', slug: 'design-branding', description: 'Design and branding services' },
        { id: 2, name: 'Digital Marketing', slug: 'digital-marketing', description: 'Digital marketing strategies and services' },
        { id: 3, name: 'E-commerce Development', slug: 'ecommerce-development', description: 'E-commerce website development' },
        { id: 4, name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and user experience design' },
        { id: 5, name: 'Specialized Tech', slug: 'specialized-tech', description: 'Specialized technology solutions' },
        { id: 6, name: 'Business Packages', slug: 'business-packages', description: 'Complete business solution packages' },
        { id: 7, name: 'API Development & Integration', slug: 'api-development-integration', description: 'API development and system integration' },
        { id: 8, name: 'General', slug: 'general', description: 'General blog posts and articles' }
      ];
      res.status(200).json(fallbackCategories);
    }
  }
);

// @desc    Get all portfolio items
// @route   GET /api/admin/portfolio
// @access  Private/Admin
router.get(
  '/portfolio',
  protect,
  authorize('content:list'),
  async (req, res) => {
    try {
      const portfolioItems = await PortfolioItem.findAll({
        order: [['created_at', 'DESC']],
      });

      // Transform the data to match frontend expectations
      const transformedItems = portfolioItems.map(item => {
        return {
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          category: item.category || 'General',
          author: 'Admin', // Since PortfolioItem doesn't have author relationship currently
          client: item.client_name,
          technologies: item.technologies || [],
          images: item.gallery_images || [],
          cover_image: item.featured_image,
          featured_image: item.featured_image,
          project_url: item.live_url,
          github_url: item.github_url,
          externalUrl: item.live_url,
          status: item.status,
          featured: item.featured,
          created_at: item.created_at,
          updated_at: item.updated_at,
          completed_at: item.project_date
        };
      });

      res.status(200).json(transformedItems);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching portfolio items', error: error.message });
    }
  }
);

// @desc    Get single portfolio item
// @route   GET /api/admin/portfolio/:id
// @access  Private/Admin
router.get(
  '/portfolio/:id',
  protect,
  authorize('content:view'),
  async (req, res) => {
    try {
      const item = await PortfolioItem.findByPk(req.params.id);
      
      if (!item) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      
      const transformedItem = {
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        category: item.category || 'General',
        author: 'Admin', // Since PortfolioItem doesn't have author relationship currently
        client: item.client_name,
        technologies: item.technologies || [],
        images: item.gallery_images || [],
        cover_image: item.featured_image,
        featured_image: item.featured_image,
        project_url: item.live_url,
        github_url: item.github_url,
        externalUrl: item.live_url,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        completed_at: item.project_date
      };

      res.status(200).json(transformedItem);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching portfolio item', error: error.message });
    }
  }
);

// @desc    Create a new portfolio item
// @route   POST /api/admin/portfolio
// @access  Private/Admin
router.post(
  '/portfolio',
  protect,
  authorize('content:create'),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        technologies,
        client,
        project_url,
        github_url,
        cover_image,
        images,
        status,
        tags,
        externalUrl
      } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({ message: 'Title, description, and category are required.' });
      }

      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      const techArray = Array.isArray(technologies) ? technologies : (technologies || '').split(',').map(t => t.trim()).filter(Boolean);
      const tagArray = Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean);

      const newItem = await PortfolioItem.create({
        title,
        description,
        slug,
        status: status || 'published',
        featured_image: cover_image,
        technologies: techArray,
        category,
        client_name: client,
        live_url: project_url,
        github_url,
        gallery_images: images || (cover_image ? [cover_image] : []),
        project_date: new Date()
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      res.status(500).json({ message: 'Error creating portfolio item', error: error.message });
    }
  }
);

// @desc    Update a portfolio item
// @route   PUT /api/admin/portfolio/:id
// @access  Private/Admin
router.put(
  '/portfolio/:id',
  protect,
  authorize('content:update'),
  async (req, res) => {
    try {
      const item = await PortfolioItem.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      
      const {
        title,
        description,
        category,
        technologies,
        client,
        project_url,
        github_url,
        cover_image,
        images,
        status,
        tags,
        externalUrl
      } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({ message: 'Title, description, and category are required.' });
      }
      
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const techArray = Array.isArray(technologies) ? technologies : (technologies || '').split(',').map(t => t.trim()).filter(Boolean);

      const updatedData = {
        title,
        description,
        slug,
        status: status || 'published',
        featured_image: cover_image,
        technologies: techArray,
        category,
        client_name: client,
        live_url: project_url,
        github_url,
        gallery_images: images || (cover_image ? [cover_image] : [])
      };

      await item.update(updatedData);
      res.status(200).json(item);
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      res.status(500).json({ message: 'Error updating portfolio item', error: error.message });
    }
  }
);

// @desc    Update portfolio item status
// @route   PATCH /api/admin/portfolio/:id
// @access  Private/Admin
router.patch(
  '/portfolio/:id',
  protect,
  authorize('content:update'),
  async (req, res) => {
    try {
      const item = await PortfolioItem.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      await item.update(req.body);
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: 'Error updating portfolio item', error: error.message });
    }
  }
);

// @desc    Delete a portfolio item
// @route   DELETE /api/admin/portfolio/:id
// @access  Private/Admin
router.delete(
  '/portfolio/:id',
  protect,
  authorize('content:delete'),
  async (req, res) => {
    try {
      const item = await PortfolioItem.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      await item.destroy();
      res.status(200).json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting portfolio item', error: error.message });
    }
  }
);

// --- Contact Management ---

// @desc    Get all contacts with pagination and filtering
// @route   GET /api/admin/contacts
// @access  Private/Admin
router.get(
  '/contacts',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        contact_type: contactType,
        priority, 
        search,
        dateFrom,
        dateTo,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Add filters
      if (status) whereClause.status = status;
      if (contactType) whereClause.contact_type = contactType;
      if (priority) whereClause.priority = priority;
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { subject: { [Op.like]: `%${search}%` } },
          { message: { [Op.like]: `%${search}%` } }
        ];
      }

      // Add date range filter
      if (dateFrom || dateTo) {
        whereClause.created_at = {};
        if (dateFrom) {
          whereClause.created_at[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          // Add one day to include the entire dateTo day
          const endDate = new Date(dateTo);
          endDate.setDate(endDate.getDate() + 1);
          whereClause.created_at[Op.lt] = endDate;
        }
      }

      console.log('Query params:', req.query);
      console.log('Constructed whereClause:', whereClause);

      const { count, rows: contacts } = await Contact.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: User,
            as: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });

      console.log('Found contacts:', count);

      res.status(200).json({
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error in /api/admin/contacts route:', error);
      res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
  }
);

// @desc    Get single contact with full details
// @route   GET /api/admin/contacts/:id
// @access  Private/Admin
router.get(
  '/contacts/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const contact = await Contact.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contact', error: error.message });
    }
  }
);

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
router.put(
  '/contacts/:id/status',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['new', 'read', 'in_progress', 'replied', 'resolved', 'closed'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const contact = await Contact.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      await contact.update({ status });
      res.status(200).json({ message: 'Contact status updated successfully', contact });
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact status', error: error.message });
    }
  }
);

// @desc    Update contact priority
// @route   PUT /api/admin/contacts/:id/priority
// @access  Private/Admin
router.put(
  '/contacts/:id/priority',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { priority } = req.body;
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority' });
      }

      const contact = await Contact.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      await contact.update({ priority });
      res.status(200).json({ message: 'Contact priority updated successfully', contact });
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact priority', error: error.message });
    }
  }
);

// @desc    Assign contact to user
// @route   PUT /api/admin/contacts/:id/assign
// @access  Private/Admin
router.put(
  '/contacts/:id/assign',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { assigned_to } = req.body;

      const contact = await Contact.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      if (assigned_to) {
        const user = await User.findByPk(assigned_to);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }

      await contact.update({ assigned_to });
      res.status(200).json({ message: 'Contact assigned successfully', contact });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning contact', error: error.message });
    }
  }
);

// @desc    Add admin note to contact
// @route   PUT /api/admin/contacts/:id/notes
// @access  Private/Admin
router.put(
  '/contacts/:id/notes',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { note } = req.body;

      if (!note || !note.trim()) {
        return res.status(400).json({ message: 'Note is required' });
      }

      const contact = await Contact.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      await contact.addNote(note.trim());
      res.status(200).json({ message: 'Note added successfully', contact });
    } catch (error) {
      res.status(500).json({ message: 'Error adding note', error: error.message });
    }
  }
);

// @desc    Get contact statistics
// @route   GET /api/admin/contacts/stats
// @access  Private/Admin
router.get(
  '/contacts/stats',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { period } = req.query;
      
      const stats = await Contact.getContactStats(period ? parseInt(period) : null);
      const unreadCount = await Contact.getUnreadCount();
      const overdueContacts = await Contact.getOverdueContacts(24);

      res.status(200).json({
        stats,
        unreadCount,
        overdueCount: overdueContacts.length
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contact statistics', error: error.message });
    }
  }
);

// @desc    Export contacts to CSV
// @route   GET /api/admin/contacts/export
// @access  Private/Admin
router.get(
  '/contacts/export',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const { 
        status, 
        contact_type: contactType,
        priority, 
        search,
        dateFrom,
        dateTo
      } = req.query;

      const whereClause = {};

      // Add filters (same as main contacts route)
      if (status) whereClause.status = status;
      if (contactType) whereClause.contact_type = contactType;
      if (priority) whereClause.priority = priority;
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { subject: { [Op.like]: `%${search}%` } },
          { message: { [Op.like]: `%${search}%` } }
        ];
      }

      // Add date range filter
      if (dateFrom || dateTo) {
        whereClause.created_at = {};
        if (dateFrom) {
          whereClause.created_at[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          const endDate = new Date(dateTo);
          endDate.setDate(endDate.getDate() + 1);
          whereClause.created_at[Op.lt] = endDate;
        }
      }

      const contacts = await Contact.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });

      // Convert to CSV format
      const csvHeader = 'ID,Name,Email,Phone,Subject,Message,Type,Status,Priority,Source,Created At,Assigned To\n';
      const csvRows = contacts.map(contact => {
        const assignedUser = contact.assignedUser 
          ? `"${contact.assignedUser.first_name} ${contact.assignedUser.last_name} (${contact.assignedUser.email})"` 
          : '';
        
        return [
          contact.id,
          `"${contact.name}"`,
          `"${contact.email}"`,
          `"${contact.phone || ''}"`,
          `"${contact.subject}"`,
          `"${contact.message.replace(/"/g, '""')}"`, // Escape quotes in message
          contact.contact_type,
          contact.status,
          contact.priority,
          `"${contact.source || ''}"`,
          contact.created_at.toISOString(),
          assignedUser
        ].join(',');
      }).join('\n');

      const csvContent = csvHeader + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      res.status(500).json({ message: 'Error exporting contacts', error: error.message });
    }
  }
);

// @desc    Delete contact
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
router.delete(
  '/contacts/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const contact = await Contact.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      await contact.destroy();
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
  }
);

// --- Services Management ---

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin
router.get(
  '/services',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const services = await Service.findAll({
        order: [['category', 'ASC'], ['name', 'ASC']]
      });

      const transformedServices = services.map(service => {
        const s = service.toJSON();
        s.features = typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || []);
        s.pricing = typeof s.pricing === 'string' ? JSON.parse(s.pricing) : (s.pricing || []);
        s.sections = typeof s.sections === 'string' ? JSON.parse(s.sections) : (s.sections || []);
        s.featureCount = s.features.length;
        return s;
      });

      res.status(200).json(transformedServices);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
  }
);

// @desc    Get single service
// @route   GET /api/admin/services/:id
// @access  Private/Admin
router.get(
  '/services/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service', error: error.message });
    }
  }
);

// @desc    Create a new service
// @route   POST /api/admin/services
// @access  Private/Admin
router.post(
  '/services',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const newService = await Service.create(req.body);
      res.status(201).json({ message: 'Service created successfully', service: newService });
    } catch (error) {
      res.status(500).json({ message: 'Error creating service', error: error.message });
    }
  }
);

// @desc    Update a service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
router.put(
  '/services/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      await service.update(req.body);
      res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service', error: error.message });
    }
  }
);

// @desc    Update service status
// @route   PATCH /api/admin/services/:id
// @access  Private/Admin
router.patch(
  '/services/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      await service.update(req.body);
      res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service', error: error.message });
    }
  }
);

// @desc    Delete a service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
router.delete(
  '/services/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      await service.destroy();
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service', error: error.message });
    }
  }
);

// @desc    Toggle service status
// @route   PUT /api/admin/services/:id/status
// @access  Private/Admin
router.put(
  '/services/:id/status',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      await service.update({ is_active: req.body.isActive });
      res.status(200).json({ message: 'Service status updated successfully', service });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service status', error: error.message });
    }
  }
);

// @desc    Toggle service popular status
// @route   PUT /api/admin/services/:id/popular
// @access  Private/Admin
router.put(
  '/services/:id/popular',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      await service.update({ is_popular: req.body.isPopular });
      res.status(200).json({ message: 'Service popular status updated successfully', service });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service popular status', error: error.message });
    }
  }
);

// --- Team Management ---

// @desc    Get all team members
// @route   GET /api/admin/team
// @access  Private/Admin
router.get(
  '/team',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const teamMembers = await Team.findAll({
        order: [['name', 'ASC']]
      });
      res.status(200).json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team members', error: error.message });
    }
  }
);

// @desc    Get single team member
// @route   GET /api/admin/team/:id
// @access  Private/Admin
router.get(
  '/team/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const teamMember = await Team.findByPk(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      res.status(200).json(teamMember);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team member', error: error.message });
    }
  }
);

// @desc    Create a new team member
// @route   POST /api/admin/team
// @access  Private/Admin
router.post(
  '/team',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const newTeamMember = await Team.create(req.body);
      res.status(201).json({ message: 'Team member created successfully', teamMember: newTeamMember });
    } catch (error) {
      res.status(500).json({ message: 'Error creating team member', error: error.message });
    }
  }
);

// @desc    Update a team member
// @route   PUT /api/admin/team/:id
// @access  Private/Admin
router.put(
  '/team/:id',
  protect,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const teamMember = await Team.findByPk(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      await teamMember.update(req.body);
      res.status(200).json({ message: 'Team member updated successfully', teamMember });
    } catch (error) {
      res.status(500).json({ message: 'Error updating team member', error: error.message });
    }
  }
);

// @desc    Delete a team member
// @route   DELETE /api/admin/team/:id
// @access  Private/Admin
router.delete(
  '/team/:id',
  protect,
  authorize('team:delete'),
  async (req, res) => {
    try {
      const teamMember = await Team.findByPk(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      await teamMember.destroy();
      res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting team member', error: error.message });
    }
  }
);

// --- Reviews Management (subset of contacts) ---

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private/Admin
  router.get(
    '/reviews',
    protect,
    authorize('reviews:list'),
    async (req, res) => {
    try {
      const reviews = await Contact.findAll({
        where: { contact_type: 'review' },
        logging: console.log
      });
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
  }
);

// @desc    Update review status
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
  router.put(
    '/reviews/:id/status',
    protect,
    authorize('reviews:update'),
    async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['new', 'read', 'approved', 'rejected', 'featured'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const review = await Contact.findOne({ 
        where: { id: req.params.id, contact_type: 'review' }
      });
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.update({ status });
      res.status(200).json({ message: 'Review status updated successfully', review });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review status', error: error.message });
    }
  }
);

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
  router.delete(
    '/reviews/:id',
    protect,
    authorize('reviews:delete'),
    async (req, res) => {
    try {
      const review = await Contact.findOne({ 
        where: { id: req.params.id, contact_type: 'review' }
      });
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.destroy();
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  }
);

// @desc    Get content management data
// @route   GET /api/admin/content-management
// @access  Private/Admin
router.get(
  '/content-management',
  protect,
  authorize('content:list'),
  async (req, res) => {
    try {
      // This would typically come from a content management table
      // For now, return default structure
      const defaultContent = [
        {
          name: 'Home Page',
          sections: [
            {
              id: 'hero-title',
              type: 'text',
              section: 'hero',
              key: 'title',
              label: 'Hero Title',
              value: 'Innovative Digital Solutions for Modern Businesses',
              description: 'Main heading on the homepage',
              page: 'home'
            },
            {
              id: 'hero-subtitle',
              type: 'rich_text',
              section: 'hero',
              key: 'subtitle',
              label: 'Hero Subtitle',
              value: 'We transform ideas into powerful digital experiences that drive growth and success.',
              description: 'Subtitle text below the main heading',
              page: 'home'
            }
          ]
        }
      ];
      
      res.status(200).json(defaultContent);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching content management data', error: error.message });
    }
  }
);

// @desc    Update content management data
// @route   PUT /api/admin/content-management
// @access  Private/Admin
router.put(
  '/content-management',
  protect,
  authorize('content:update'),
  async (req, res) => {
    try {
      // This would typically save to a content management table
      // For now, just return success
      res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating content', error: error.message });
    }
  }
);

// @desc    Get service detail for editing
// @route   GET /api/admin/services/:slug/detail
// @access  Private/Admin
router.get(
  '/services/:slug/detail',
  protect,
  authorize('services:view'),
  async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Import service details from the static data
      const { serviceDetails } = require('../scripts/servicesDataForSeed');
      
      if (serviceDetails[slug]) {
        res.status(200).json(serviceDetails[slug]);
      } else {
        // Return a default structure if service detail doesn't exist
        const defaultDetail = {
          slug,
          title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          headerImage: '/images/work/project1.jpg',
          pricing: {
            superTitle: '/ pricing /',
            title: 'Simple and flexible pricing.',
            tiers: [
              {
                name: 'Basic',
                subtitle: 'Perfect for small businesses',
                price: '$99',
                priceSuffix: '/month',
                features: [
                  'Feature 1',
                  'Feature 2',
                  'Feature 3'
                ],
                cta: 'Get started',
                ctaHref: '/contact',
                isPopular: false
              }
            ]
          }
        };
        res.status(200).json(defaultDetail);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service detail', error: error.message });
    }
  }
);

// @desc    Update service detail
// @route   PUT /api/admin/services/:slug/detail
// @access  Private/Admin
router.put(
  '/services/:slug/detail',
  protect,
  authorize('services:update'),
  async (req, res) => {
    try {
      const { slug } = req.params;
      const serviceDetail = req.body;
      
      // This would typically save to a service details table
      // For now, just return success
      res.status(200).json({ message: 'Service detail updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service detail', error: error.message });
    }
  }
);

// FAQ Management endpoints
router.get('/faq', protect, async (req, res) => {
  try {
    // For now, we'll store FAQ data in a JSON format in the database
    // You could create a separate FAQ model if needed
    let faqSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'faq_items'
      } 
    });

    if (!faqSetting) {
      // Create default FAQ content if it doesn't exist
      const defaultFAQs = [
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
        }
      ];

      faqSetting = await SiteSetting.create({
        setting_key: 'faq_items',
        setting_value: JSON.stringify(defaultFAQs),
        setting_type: 'content',
        description: 'FAQ items data',
        is_public: true,
        auto_load: false
      });
    }

    const faqData = JSON.parse(faqSetting.setting_value);
    res.json(faqData);
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ data' });
  }
});

router.put('/faq', protect, async (req, res) => {
  try {
    const { faqItems } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'faq_items' },
      defaults: {
        setting_key: 'faq_items',
        setting_value: JSON.stringify(faqItems),
        setting_type: 'content',
        description: 'FAQ items data',
        is_public: true,
        auto_load: false
      }
    });

    await setting.update({
      setting_value: JSON.stringify(faqItems)
    });

    res.json({ message: 'FAQ updated successfully' });
  } catch (error) {
    console.error('Error updating FAQ data:', error);
    res.status(500).json({ error: 'Failed to update FAQ data' });
  }
});

// Mission Points Management
router.get('/mission-points', protect, async (req, res) => {
  try {
    let missionSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'mission_points'
      } 
    });

    if (!missionSetting) {
      // Create default mission points if they don't exist
      const defaultMissionPoints = [
        {
          icon: 'Users',
          title: 'Customer Centric',
          description: 'Personalized services that cater to your specific needs, ensuring that our solutions fit your business perfectly.'
        },
        {
          icon: 'Handshake',
          title: 'Collaborative Partnership',
          description: 'We work alongside you, maintaining open communication to fully understand your vision and incorporate your feedback into our strategies.'
        },
        {
          icon: 'Gem',
          title: 'Commitment to Quality',
          description: 'Our expert team stays updated on industry trends, delivering innovative solutions with a strong focus on quality.'
        },
        {
          icon: 'Target',
          title: 'Achieving Goals Together',
          description: 'We measure our success by your results. Your achievements are milestones for us, and we celebrate every step forward together.'
        }
      ];

      missionSetting = await SiteSetting.create({
        setting_key: 'mission_points',
        setting_value: JSON.stringify(defaultMissionPoints),
        setting_type: 'content',
        description: 'Mission points data for home page',
        is_public: true,
        auto_load: true
      });
    }

    const missionData = JSON.parse(missionSetting.setting_value);
    res.json(missionData);
  } catch (error) {
    console.error('Error fetching mission points:', error);
    res.status(500).json({ error: 'Failed to fetch mission points' });
  }
});

router.put('/mission-points', protect, async (req, res) => {
  try {
    const { missionPoints } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'mission_points' },
      defaults: {
        setting_key: 'mission_points',
        setting_value: JSON.stringify(missionPoints),
        setting_type: 'content',
        description: 'Mission points data for home page',
        is_public: true,
        auto_load: true
      }
    });

    await setting.update({
      setting_value: JSON.stringify(missionPoints)
    });

    res.json({ message: 'Mission points updated successfully' });
  } catch (error) {
    console.error('Error updating mission points:', error);
    res.status(500).json({ error: 'Failed to update mission points' });
  }
});

// Process Phases Management
router.get('/process-phases', protect, async (req, res) => {
  try {
    let processSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'process_phases'
      } 
    });

    if (!processSetting) {
      // Create default process phases if they don't exist
      const defaultProcessPhases = [
        {
          id: 1,
          mainIcon: 'ClipboardList',
          title: 'Planning',
          subtitle: '& Requirements',
          description: 'We define the project\'s scope, goals, and foundational needs, aligning expectations for a clear roadmap ahead.',
          color: 'text-[#1FBBD2]',
          bgColor: 'hover:bg-cyan-50',
          darkBgColor: 'dark:hover:bg-cyan-900/20',
          deliverables: [
            { text: 'Detailed Project Scope Document', icon: 'FileText' },
            { text: 'Stakeholder Register', icon: 'Users' },
            { text: 'User & Technical Requirements', icon: 'ClipboardCheck' },
            { text: 'Draft Project Plan & Schedule', icon: 'Calendar' }
          ]
        },
        {
          id: 2,
          mainIcon: 'Palette',
          title: 'Design',
          subtitle: '& Development',
          description: 'Transforming concepts into functional realities, we craft user-centric designs and build robust, scalable solutions.',
          color: 'text-[#F39C12]',
          bgColor: 'hover:bg-amber-50',
          darkBgColor: 'dark:hover:bg-amber-900/20',
          deliverables: [
            { text: 'System Architecture Design', icon: 'Network' },
            { text: 'UI/UX Mockups & Prototypes', icon: 'Layout' },
            { text: 'Alpha Version of Modules/Components', icon: 'Code' },
            { text: 'Unit Test Cases', icon: 'TestTube' }
          ]
        }
      ];

      processSetting = await SiteSetting.create({
        setting_key: 'process_phases',
        setting_value: JSON.stringify(defaultProcessPhases),
        setting_type: 'content',
        description: 'Process phases data for home page',
        is_public: true,
        auto_load: true
      });
    }

    const processData = JSON.parse(processSetting.setting_value);
    res.json(processData);
  } catch (error) {
    console.error('Error fetching process phases:', error);
    res.status(500).json({ error: 'Failed to fetch process phases' });
  }
});

router.put('/process-phases', protect, async (req, res) => {
  try {
    const { processPhases } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'process_phases' },
      defaults: {
        setting_key: 'process_phases',
        setting_value: JSON.stringify(processPhases),
        setting_type: 'content',
        description: 'Process phases data for home page',
        is_public: true,
        auto_load: true
      }
    });

    await setting.update({
      setting_value: JSON.stringify(processPhases)
    });

    res.json({ message: 'Process phases updated successfully' });
  } catch (error) {
    console.error('Error updating process phases:', error);
    res.status(500).json({ error: 'Failed to update process phases' });
  }
});

// Site Identity Management
router.get('/site-identity', protect, async (req, res) => {
  try {
    console.log('Site identity GET route called');
    
    let siteIdentitySetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'site_identity'
      } 
    });

    if (!siteIdentitySetting) {
      // Create default site identity if it doesn't exist
      const defaultSiteIdentity = {
        siteTitle: 'ClickBit - Web Solutions',
        metaDescription: 'ClickBit - Custom Web & Software Solutions',
        faviconUrl: '/favicon.ico'
      };

      siteIdentitySetting = await SiteSetting.create({
        setting_key: 'site_identity',
        setting_value: JSON.stringify(defaultSiteIdentity),
        setting_type: 'system',
        description: 'Site identity settings including title and favicon',
        is_public: true,
        auto_load: true
      });
    }

    const siteData = JSON.parse(siteIdentitySetting.setting_value);
    console.log('Returning site data:', siteData);
    res.json(siteData);
  } catch (error) {
    console.error('Error fetching site identity:', error);
    res.status(500).json({ error: 'Failed to fetch site identity' });
  }
});

router.put('/site-identity', protect, async (req, res) => {
  try {
    const { siteIdentity } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'site_identity' },
      defaults: {
        setting_key: 'site_identity',
        setting_value: JSON.stringify(siteIdentity),
        setting_type: 'system',
        description: 'Site identity settings including title and favicon',
        is_public: true,
        auto_load: true
      }
    });

    await setting.update({
      setting_value: JSON.stringify(siteIdentity)
    });

    res.json({ message: 'Site identity updated successfully' });
  } catch (error) {
    console.error('Error updating site identity:', error);
    res.status(500).json({ error: 'Failed to update site identity' });
  }
});

// Contact Information Management
router.get('/contact-info', protect, async (req, res) => {
  try {
    let contactInfoSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'contact_info'
      } 
    });

    if (!contactInfoSetting) {
      // Create default contact info if it doesn't exist
      const defaultContactInfo = {
        phone1: '+61 2 7229 9577',
        phone2: '+61 422 512 130',
        email: 'info@clickbit.com.au',
        address: '44 Shoreline Road\nMoorebank NSW 2170\nAustralia',
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nWeekend: By appointment',
        googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.643330663454!2d150.9133093152115!3d-33.9249269806403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b1295a3c9a35e7d%3A0x8f4f4c9c1c4f2e5a!2s44%20Shoreline%20Rd%2C%20Moorebank%20NSW%202170%2C%20Australia!5e0!3m2!1sen!2sau!4v1620211993456!5m2!1sen!2sus',
        socialLinks: [
          { platform: 'Facebook', url: 'https://www.facebook.com/clickbitau/' },
          { platform: 'Instagram', url: 'https://www.instagram.com/clickbitau/' },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/clickbitau/' }
        ]
      };

      contactInfoSetting = await SiteSetting.create({
        setting_key: 'contact_info',
        setting_value: JSON.stringify(defaultContactInfo),
        setting_type: 'system',
        description: 'Company contact information',
        is_public: true,
        auto_load: true
      });
    }

    const contactData = JSON.parse(contactInfoSetting.setting_value);
    res.json(contactData);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
});

router.put('/contact-info', protect, async (req, res) => {
  try {
    const { contactInfo } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'contact_info' },
      defaults: {
        setting_key: 'contact_info',
        setting_value: JSON.stringify(contactInfo),
        setting_type: 'system',
        description: 'Company contact information',
        is_public: true,
        auto_load: true
      }
    });

    await setting.update({
      setting_value: JSON.stringify(contactInfo)
    });

    res.json({ message: 'Contact info updated successfully' });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ error: 'Failed to update contact info' });
  }
});

// Footer Content Management
router.get('/footer-content', protect, async (req, res) => {
  try {
    let footerSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'footer_content'
      } 
    });

    if (!footerSetting) {
      // Create default footer content if it doesn't exist
      const defaultFooterContent = {
        companyDescription: 'Empowering businesses with innovative digital solutions to connect, engage, and grow.'
      };

      footerSetting = await SiteSetting.create({
        setting_key: 'footer_content',
        setting_value: JSON.stringify(defaultFooterContent),
        setting_type: 'content',
        description: 'Footer content and company description',
        is_public: true,
        auto_load: true
      });
    }

    const footerData = JSON.parse(footerSetting.setting_value);
    res.json(footerData);
  } catch (error) {
    console.error('Error fetching footer content:', error);
    res.status(500).json({ error: 'Failed to fetch footer content' });
  }
});

router.put('/footer-content', protect, async (req, res) => {
  try {
    const { footerContent } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'footer_content' },
      defaults: {
        setting_key: 'footer_content',
        setting_value: JSON.stringify(footerContent),
        setting_type: 'content',
        description: 'Footer content and company description',
        is_public: true,
        auto_load: true
      }
    });

    await setting.update({
      setting_value: JSON.stringify(footerContent)
    });

    res.json({ message: 'Footer content updated successfully' });
  } catch (error) {
    console.error('Error updating footer content:', error);
    res.status(500).json({ error: 'Failed to update footer content' });
  }
});

// Navigation Management
router.get('/navigation', protect, async (req, res) => {
  try {
    let navigationSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'main_navigation'
      } 
    });

    if (!navigationSetting) {
      // Create default navigation if it doesn't exist
      const defaultNavigation = [
        { label: 'About', path: '/about', order: 1 },
        { label: 'Services', path: '/services', order: 2, hasDropdown: true },
        { label: 'Portfolio', path: '/portfolio', order: 3 },
        { label: 'Contact', path: '/contact', order: 4 }
      ];

      navigationSetting = await SiteSetting.create({
        setting_key: 'main_navigation',
        setting_value: JSON.stringify(defaultNavigation),
        setting_type: 'system',
        description: 'Main site navigation menu items',
        is_public: true,
        auto_load: true
      });
    }

    const navData = JSON.parse(navigationSetting.setting_value);
    res.json(navData);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    res.status(500).json({ error: 'Failed to fetch navigation' });
  }
});

router.put('/navigation', protect, async (req, res) => {
  try {
    const { navigation } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'main_navigation' },
      defaults: {
        setting_key: 'main_navigation',
        setting_value: JSON.stringify(navigation),
        setting_type: 'system',
        description: 'Main site navigation menu items',
        is_public: true,
        auto_load: true
      }
    });

    await setting.update({
      setting_value: JSON.stringify(navigation)
    });

    res.json({ message: 'Navigation updated successfully' });
  } catch (error) {
    console.error('Error updating navigation:', error);
    res.status(500).json({ error: 'Failed to update navigation' });
  }
});

// Marketing & Integrations Management
router.get('/marketing-integrations', protect, async (req, res) => {
  try {
    let marketingSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'marketing_integrations'
      } 
    });

    if (!marketingSetting) {
      // Create default marketing integrations if they don't exist
      const defaultMarketingIntegrations = {
        headerScripts: '',
        googleSearchConsoleTag: '',
        googleAnalyticsId: '',
        facebookPixelId: '',
        customMetaTags: ''
      };

      marketingSetting = await SiteSetting.create({
        setting_key: 'marketing_integrations',
        setting_value: JSON.stringify(defaultMarketingIntegrations),
        setting_type: 'marketing',
        description: 'Marketing and analytics integration settings',
        is_public: false,
        auto_load: false
      });
    }

    const marketingData = JSON.parse(marketingSetting.setting_value);
    res.json(marketingData);
  } catch (error) {
    console.error('Error fetching marketing integrations:', error);
    res.status(500).json({ error: 'Failed to fetch marketing integrations' });
  }
});

router.put('/marketing-integrations', protect, async (req, res) => {
  try {
    const { marketingIntegrations } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'marketing_integrations' },
      defaults: {
        setting_key: 'marketing_integrations',
        setting_value: JSON.stringify(marketingIntegrations),
        setting_type: 'marketing',
        description: 'Marketing and analytics integration settings',
        is_public: false,
        auto_load: false
      }
    });

    await setting.update({
      setting_value: JSON.stringify(marketingIntegrations)
    });

    res.json({ message: 'Marketing integrations updated successfully' });
  } catch (error) {
    console.error('Error updating marketing integrations:', error);
    res.status(500).json({ error: 'Failed to update marketing integrations' });
  }
});

// Billing Settings Management
router.get('/billing-settings', protect, async (req, res) => {
  try {
    let billingSetting = await SiteSetting.findOne({ 
      where: { 
        setting_key: 'billing_settings'
      } 
    });

    if (!billingSetting) {
      // Create default billing settings if they don't exist
      const defaultBillingSettings = {
        stripePublishableKey: '',
        stripeSecretKey: '',
        paypalClientId: '',
        paypalClientSecret: '',
        currencyCode: 'AUD',
        taxRate: 10, // GST for Australia
        companyAbn: '',
        billingAddress: '',
        paymentTerms: 'Net 30'
      };

      billingSetting = await SiteSetting.create({
        setting_key: 'billing_settings',
        setting_value: JSON.stringify(defaultBillingSettings),
        setting_type: 'billing',
        description: 'Payment and billing configuration settings',
        is_public: false,
        auto_load: false
      });
    }

    const billingData = JSON.parse(billingSetting.setting_value);
    res.json(billingData);
  } catch (error) {
    console.error('Error fetching billing settings:', error);
    res.status(500).json({ error: 'Failed to fetch billing settings' });
  }
});

router.put('/billing-settings', protect, async (req, res) => {
  try {
    const { billingSettings } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'billing_settings' },
      defaults: {
        setting_key: 'billing_settings',
        setting_value: JSON.stringify(billingSettings),
        setting_type: 'billing',
        description: 'Payment and billing configuration settings',
        is_public: false,
        auto_load: false
      }
    });

    await setting.update({
      setting_value: JSON.stringify(billingSettings)
    });

    // Refresh payment providers after updating billing settings
    try {
      const { refreshPaymentProviders } = require('../routes/payments');
      if (refreshPaymentProviders) {
        await refreshPaymentProviders();
        console.log('✅ Payment providers refreshed after billing settings update');
      }
    } catch (refreshError) {
      console.warn('⚠️  Could not refresh payment providers:', refreshError.message);
    }

    res.json({ message: 'Billing settings updated successfully' });
  } catch (error) {
    console.error('Error updating billing settings:', error);
    res.status(500).json({ error: 'Failed to update billing settings' });
  }
});

// --- Orders Management ---

// @desc    Get all orders with pagination, filtering, and sorting
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get(
  '/orders',
  protect,
  authorize('orders:list'),
  async (req, res) => {
    try {
      const {
        status,
        search,
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Build where conditions
      const whereConditions = {};
      if (status && status !== 'all') {
        whereConditions.status = status;
      }
      
      if (search) {
        whereConditions[Op.or] = [
          { order_number: { [Op.like]: `%${search}%` } },
          { guest_email: { [Op.like]: `%${search}%` } },
          { '$User.first_name$': { [Op.like]: `%${search}%` } },
          { '$User.last_name$': { [Op.like]: `%${search}%` } },
          { '$User.email$': { [Op.like]: `%${search}%` } }
        ];
      }

      // Get orders with pagination
      const { count, rows: orders } = await Order.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: OrderItem,
            as: 'items',
            attributes: ['id', 'product_name', 'quantity', 'unit_price', 'total_price'],
            required: false
          }
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: offset,
        distinct: true
      });

      // Calculate statistics
      const allOrders = await Order.findAll({
        attributes: [
          'status',
          'payment_status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
        ],
        group: ['status', 'payment_status'],
        raw: true
      });

      // Process stats
      const stats = {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        revenue: 0
      };

      allOrders.forEach(order => {
        const status = order.status;
        const count = parseInt(order.count) || 0;
        const revenue = parseFloat(order.revenue) || 0;
        
        stats.total += count;
        if (stats.hasOwnProperty(status)) {
          stats[status] += count;
        }
        
        if (order.payment_status === 'paid') {
          stats.revenue += revenue;
        }
      });

      // Format response
      const formattedOrders = orders.map(order => ({
        id: order.id,
        order_number: order.order_number,
        guest_email: order.guest_email,
        status: order.status,
        payment_status: order.payment_status,
        total_amount: parseFloat(order.total_amount),
        currency: order.currency,
        items_count: order.items ? order.items.length : order.items_count,
        created_at: order.created_at,
        updated_at: order.updated_at,
        customer: order.customer ? {
          first_name: order.customer.first_name,
          last_name: order.customer.last_name,
          email: order.customer.email
        } : null
      }));

      res.status(200).json({
        orders: formattedOrders,
        stats: stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ 
        message: 'Error fetching orders', 
        error: error.message 
      });
    }
  }
);

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put(
  '/orders/:id/status',
  protect,
  authorize('orders:update'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') 
        });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update order status
      order.status = status;
      
      // Set appropriate timestamps
      if (status === 'shipped') {
        order.shipped_at = new Date();
      } else if (status === 'delivered') {
        order.delivered_at = new Date();
      } else if (status === 'cancelled') {
        order.cancelled_at = new Date();
      } else if (status === 'refunded') {
        order.refunded_at = new Date();
      }

      await order.save();

      res.status(200).json({
        message: 'Order status updated successfully',
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          updated_at: order.updated_at
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ 
        message: 'Error updating order status', 
        error: error.message 
      });
    }
  }
);

// @desc    Get single order details
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
router.get(
  '/orders/:id',
  protect,
  authorize('orders:view'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
            required: false
          },
          {
            model: OrderItem,
            as: 'items',
            required: false
          }
        ]
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ 
        message: 'Error fetching order details', 
        error: error.message 
      });
    }
  }
);

// ========================== BLOG SCHEDULING ROUTES ==========================

// @desc    Get all scheduled posts
// @route   GET /api/admin/scheduled-posts
// @access  Private/Admin
router.get(
  '/scheduled-posts',
  protect,
  authorize('content:view'),
  async (req, res) => {
    try {
      const scheduledPosts = await blogScheduler.getScheduledPosts();
      res.status(200).json(scheduledPosts);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching scheduled posts', 
        error: error.message 
      });
    }
  }
);

// @desc    Manually publish a scheduled post
// @route   POST /api/admin/scheduled-posts/:id/publish
// @access  Private/Admin
router.post(
  '/scheduled-posts/:id/publish',
  protect,
  authorize('content:update'),
  async (req, res) => {
    try {
      const post = await blogScheduler.publishScheduledPost(req.params.id);
      res.status(200).json({ 
        message: 'Post published successfully', 
        post 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error publishing scheduled post', 
        error: error.message 
      });
    }
  }
);

// @desc    Get blog scheduler status
// @route   GET /api/admin/scheduler/status
// @access  Private/Admin
router.get(
  '/scheduler/status',
  protect,
  authorize('content:view'),
  (req, res) => {
    try {
      const status = blogScheduler.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error getting scheduler status', 
        error: error.message 
      });
    }
  }
);

module.exports = router; 