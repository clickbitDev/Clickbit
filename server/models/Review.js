const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 5,
    },
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  service_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Static methods
Review.getApprovedReviews = function(limit = null) {
  const options = {
    where: { status: 'approved' },
    order: [
      ['is_featured', 'DESC'],
      ['display_order', 'ASC'],
      ['created_at', 'DESC']
    ]
  };
  
  if (limit) {
    options.limit = limit;
  }
  
  return this.findAll(options);
};

Review.getFeaturedReviews = function(limit = null) {
  const options = {
    where: { 
      status: 'approved',
      is_featured: true 
    },
    order: [
      ['display_order', 'ASC'],
      ['created_at', 'DESC']
    ]
  };
  
  if (limit) {
    options.limit = limit;
  }
  
  return this.findAll(options);
};

Review.getPendingReviews = function() {
  return this.findAll({
    where: { status: 'pending' },
    order: [['created_at', 'ASC']]
  });
};

Review.getReviewStats = async function() {
  const [total, approved, pending, rejected, featured] = await Promise.all([
    this.count(),
    this.count({ where: { status: 'approved' } }),
    this.count({ where: { status: 'pending' } }),
    this.count({ where: { status: 'rejected' } }),
    this.count({ where: { is_featured: true, status: 'approved' } })
  ]);
  
  return {
    total,
    approved,
    pending,
    rejected,
    featured
  };
};

Review.approveReview = async function(id, approvedBy) {
  const review = await this.findByPk(id);
  if (!review) {
    throw new Error('Review not found');
  }
  
  await review.update({
    status: 'approved',
    approved_at: new Date(),
    approved_by: approvedBy
  });
  
  return review;
};

Review.rejectReview = async function(id) {
  const review = await this.findByPk(id);
  if (!review) {
    throw new Error('Review not found');
  }
  
  await review.update({
    status: 'rejected'
  });
  
  return review;
};

module.exports = Review;