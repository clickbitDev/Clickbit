const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PortfolioItem = sequelize.define('PortfolioItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  short_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  featured_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gallery_images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  client_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  project_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  project_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  technologies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  services_provided: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived', 'private'),
    defaultValue: 'draft',
    allowNull: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'portfolio_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PortfolioItem;