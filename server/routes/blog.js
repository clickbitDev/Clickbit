const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { BlogPost, User } = require('../models');
const Comment = require('../models/Comment');
const { Op } = require('sequelize');
const { normalizeBlogPost } = require('../utils/imagePathHelper');

// @desc    Get all blog posts (public)
// @route   GET /api/blog
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit, offset, category, tag, search } = req.query;
    
    const whereClause = {
      status: 'published',
      published_at: {
        [Op.lte]: new Date()
      }
    };

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Add category filter
    if (category) {
      whereClause.categories = {
        [Op.contains]: [category]
      };
    }

    // Add tag filter
    if (tag) {
      whereClause.tags = {
        [Op.contains]: [tag]
      };
    }

    const options = {
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['published_at', 'DESC']],
      attributes: {
        exclude: ['author_id']
      }
    };

    if (limit) {
      options.limit = parseInt(limit);
    }
    if (offset) {
      options.offset = parseInt(offset);
    }

    const { count, rows: posts } = await BlogPost.findAndCountAll(options);

    res.json({
      posts,
      pagination: {
        total: count,
        limit: parseInt(limit) || null,
        offset: parseInt(offset) || 0,
        hasMore: limit ? (parseInt(offset) || 0) + parseInt(limit) < count : false
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
});

// @desc    Get featured blog posts
// @route   GET /api/blog/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const posts = await BlogPost.findAll({
      where: {
        status: 'published',
        featured: true,
        published_at: {
          [Op.lte]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      attributes: {
        exclude: ['author_id']
      }
    });

    // Normalize image paths before sending response
    const normalizedPosts = posts.map(post => normalizeBlogPost(post.toJSON()));

    res.json(normalizedPosts);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    res.status(500).json({ message: 'Error fetching featured blog posts', error: error.message });
  }
});

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      where: {
        slug: req.params.slug,
        status: 'published'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      attributes: {
        exclude: ['author_id']
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count
    await post.increment('view_count');

    // Normalize image paths before sending response
    const normalizedPost = normalizeBlogPost(post.toJSON());

    res.json(normalizedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

// ADMIN ROUTES

// @desc    Get all blog posts for admin
// @route   GET /api/blog/admin
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { limit, offset, status, author, search } = req.query;
    
    const whereClause = {};

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Filter by author
    if (author) {
      whereClause.author_id = author;
    }

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const options = {
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: ['author_id']
      }
    };

    if (limit) {
      options.limit = parseInt(limit);
    }
    if (offset) {
      options.offset = parseInt(offset);
    }

    const { count, rows: posts } = await BlogPost.findAndCountAll(options);

    res.json({
      posts,
      pagination: {
        total: count,
        limit: parseInt(limit) || null,
        offset: parseInt(offset) || 0,
        hasMore: limit ? (parseInt(offset) || 0) + parseInt(limit) < count : false
      }
    });
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
});

// @desc    Get single blog post for editing
// @route   GET /api/blog/admin/:id
// @access  Private/Admin
router.get('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
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

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

// @desc    Create new blog post
// @route   POST /api/blog/admin
// @access  Private/Admin
router.post('/admin', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author_id: req.user.id
    };

    // Generate slug if not provided
    if (!postData.slug && postData.title) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Set published_at if status is published and no date provided
    if (postData.status === 'published' && !postData.published_at) {
      postData.published_at = new Date();
    }

    const post = await BlogPost.create(postData);
    
    const createdPost = await BlogPost.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.status(201).json({
      message: 'Blog post created successfully',
      post: createdPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/admin/:id
// @access  Private/Admin
router.put('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const updateData = { ...req.body };

    // Update published_at if changing status to published
    if (updateData.status === 'published' && post.status !== 'published' && !updateData.published_at) {
      updateData.published_at = new Date();
    }

    await post.update(updateData);

    const updatedPost = await BlogPost.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.json({
      message: 'Blog post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blog/admin/:id
// @access  Private/Admin
router.delete('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await post.destroy();

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
});

// @desc    Get blog statistics for admin
// @route   GET /api/blog/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const [total, published, draft, featured] = await Promise.all([
      BlogPost.count(),
      BlogPost.count({ where: { status: 'published' } }),
      BlogPost.count({ where: { status: 'draft' } }),
      BlogPost.count({ where: { featured: true } })
    ]);

    res.json({
      total,
      published,
      draft,
      featured
    });
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    res.status(500).json({ message: 'Error fetching blog statistics', error: error.message });
  }
});

module.exports = router;