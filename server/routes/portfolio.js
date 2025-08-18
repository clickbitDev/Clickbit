const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { PortfolioItem, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all portfolio items (public)
// @route   GET /api/portfolio
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit, offset, category, featured, technology, service } = req.query;
    
    const whereClause = {
      status: 'published'
    };

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add featured filter
    if (featured === 'true') {
      whereClause.featured = true;
    }

    // Add technology filter
    if (technology) {
      whereClause.technologies = {
        [Op.contains]: [technology]
      };
    }

    // Add service filter
    if (service) {
      whereClause.services_provided = {
        [Op.contains]: [service]
      };
    }

    const options = {
      where: whereClause,
      order: [['sort_order', 'ASC'], ['project_date', 'DESC']],
      attributes: {
        exclude: ['description'] // Exclude full description for list view
      }
    };

    if (limit) {
      options.limit = parseInt(limit);
    }
    if (offset) {
      options.offset = parseInt(offset);
    }

    const { count, rows: items } = await PortfolioItem.findAndCountAll(options);

    res.json({
      items,
      pagination: {
        total: count,
        limit: parseInt(limit) || null,
        offset: parseInt(offset) || 0,
        hasMore: limit ? (parseInt(offset) || 0) + parseInt(limit) < count : false
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ message: 'Error fetching portfolio items', error: error.message });
  }
});

// @desc    Get featured portfolio items
// @route   GET /api/portfolio/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const items = await PortfolioItem.findAll({
      where: {
        status: 'published',
        featured: true
      },
      order: [['sort_order', 'ASC'], ['project_date', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      attributes: {
        exclude: ['description']
      }
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching featured portfolio items:', error);
    res.status(500).json({ message: 'Error fetching featured portfolio items', error: error.message });
  }
});

// @desc    Get portfolio categories
// @route   GET /api/portfolio/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await PortfolioItem.findAll({
      where: {
        status: 'published',
        category: {
          [Op.not]: null
        }
      },
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categoryList = categories.map(item => item.category).filter(Boolean);

    res.json(categoryList);
  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    res.status(500).json({ message: 'Error fetching portfolio categories', error: error.message });
  }
});

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({
      where: {
        slug: req.params.slug,
        status: 'published'
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ message: 'Error fetching portfolio item', error: error.message });
  }
});

// ADMIN ROUTES

// @desc    Get all portfolio items for admin
// @route   GET /api/portfolio/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { limit, offset, status, category, search } = req.query;
    
    const whereClause = {};

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Filter by category
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { client_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const options = {
      where: whereClause,
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: ['description', 'gallery_images'] // Exclude large fields for list view
      }
    };

    if (limit) {
      options.limit = parseInt(limit);
    }
    if (offset) {
      options.offset = parseInt(offset);
    }

    const { count, rows: items } = await PortfolioItem.findAndCountAll(options);

    res.json({
      items,
      pagination: {
        total: count,
        limit: parseInt(limit) || null,
        offset: parseInt(offset) || 0,
        hasMore: limit ? (parseInt(offset) || 0) + parseInt(limit) < count : false
      }
    });
  } catch (error) {
    console.error('Error fetching admin portfolio items:', error);
    res.status(500).json({ message: 'Error fetching portfolio items', error: error.message });
  }
});

// @desc    Get single portfolio item for editing
// @route   GET /api/portfolio/admin/:id
// @access  Private/Admin
router.get('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const item = await PortfolioItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ message: 'Error fetching portfolio item', error: error.message });
  }
});

// @desc    Create new portfolio item
// @route   POST /api/portfolio/admin
// @access  Private/Admin
router.post('/admin', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const itemData = { ...req.body };

    // Generate slug if not provided
    if (!itemData.slug && itemData.title) {
      itemData.slug = itemData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const item = await PortfolioItem.create(itemData);

    res.status(201).json({
      message: 'Portfolio item created successfully',
      item
    });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ message: 'Error creating portfolio item', error: error.message });
  }
});

// @desc    Update portfolio item
// @route   PUT /api/portfolio/admin/:id
// @access  Private/Admin
router.put('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const item = await PortfolioItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await item.update(req.body);

    res.json({
      message: 'Portfolio item updated successfully',
      item
    });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ message: 'Error updating portfolio item', error: error.message });
  }
});

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/admin/:id
// @access  Private/Admin
router.delete('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const item = await PortfolioItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await item.destroy();

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ message: 'Error deleting portfolio item', error: error.message });
  }
});

// @desc    Get portfolio statistics for admin
// @route   GET /api/portfolio/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const [total, published, draft, featured] = await Promise.all([
      PortfolioItem.count(),
      PortfolioItem.count({ where: { status: 'published' } }),
      PortfolioItem.count({ where: { status: 'draft' } }),
      PortfolioItem.count({ where: { featured: true } })
    ]);

    res.json({
      total,
      published,
      draft,
      featured
    });
  } catch (error) {
    console.error('Error fetching portfolio statistics:', error);
    res.status(500).json({ message: 'Error fetching portfolio statistics', error: error.message });
  }
});

module.exports = router;