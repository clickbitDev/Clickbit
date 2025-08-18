const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { Review } = require('../models');

// @desc    Get all approved reviews for public display
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit, featured } = req.query;
    
    let reviews;
    if (featured === 'true') {
      reviews = await Review.getFeaturedReviews(limit ? parseInt(limit) : null);
    } else {
      reviews = await Review.getApprovedReviews(limit ? parseInt(limit) : null);
    }
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// @desc    Create a new review (public submission)
// @route   POST /api/reviews
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      position,
      rating,
      review_text,
      service_type,
      project_type
    } = req.body;

    if (!name || !review_text || !rating) {
      return res.status(400).json({ 
        message: 'Name, review text, and rating are required.' 
      });
    }

    const review = await Review.create({
      name,
      email,
      company,
      position,
      rating: parseInt(rating),
      review_text,
      service_type,
      project_type,
      status: 'pending'
    });

    res.status(201).json({ 
      message: 'Review submitted successfully! It will be reviewed before being published.',
      review: {
        id: review.id,
        name: review.name,
        rating: review.rating,
        status: review.status
      }
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
});

// @desc    Get all reviews for admin
// @route   GET /api/admin/reviews
// @access  Private/Admin
router.get('/admin', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    const stats = await Review.getReviewStats();
    
    res.status(200).json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// @desc    Update review status (approve/reject)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
router.put('/admin/:id/status', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { status } = req.body;
    const reviewId = req.params.id;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    let review;
    if (status === 'approved') {
      review = await Review.approveReview(reviewId, req.user.id);
    } else if (status === 'rejected') {
      review = await Review.rejectReview(reviewId);
    } else {
      review = await Review.findByPk(reviewId);
      await review.update({ status: 'pending' });
    }
    
    res.status(200).json({ message: `Review ${status} successfully`, review });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ message: 'Error updating review status', error: error.message });
  }
});

// @desc    Update review details
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
router.put('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updateData = req.body;
    
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.update(updateData);
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
router.delete('/admin/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.destroy();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

// @desc    Get review statistics
// @route   GET /api/admin/reviews/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const stats = await Review.getReviewStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ message: 'Error fetching review statistics', error: error.message });
  }
});

module.exports = router;