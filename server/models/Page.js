const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Page = sequelize.define('Page', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featured_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived', 'private'),
    defaultValue: 'draft',
    allowNull: false
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  template: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Template file name for rendering'
  },
  layout: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'default',
    comment: 'Layout template to use'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  show_in_menu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  menu_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pages',
      key: 'id'
    }
  }
}, {
  tableName: 'pages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Self-referencing association for page hierarchy
Page.belongsTo(Page, { as: 'parent', foreignKey: 'parent_id' });
Page.hasMany(Page, { as: 'children', foreignKey: 'parent_id' });

module.exports = Page;