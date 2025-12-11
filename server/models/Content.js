const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Content = sequelize.define('Content', {
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
  content_type: {
    type: DataTypes.ENUM('page', 'post', 'article', 'news', 'faq', 'policy', 'custom'),
    defaultValue: 'page',
    allowNull: false
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
  seo_data: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of tag strings'
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of category IDs'
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
    defaultValue: 0
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allow_comments: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  comment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contents',
      key: 'id'
    }
  },
  menu_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  show_in_menu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  menu_title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  custom_fields: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Custom fields for the content'
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Content-specific settings'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'contents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (content) => {
      // Set published_at if status is published
      if (content.status === 'published' && !content.published_at) {
        content.published_at = new Date();
      }
    },
    beforeUpdate: async (content) => {
      // Set published_at if status changed to published
      if (content.changed('status') && content.status === 'published' && !content.published_at) {
        content.published_at = new Date();
      }
    }
  }
});

// Instance methods
Content.prototype.getAuthor = function() {
  if (this.author_id) {
    const { User } = require('./User');
    return User.findByPk(this.author_id);
  }
  return null;
};

Content.prototype.getParent = function() {
  if (this.parent_id) {
    return Content.findByPk(this.parent_id);
  }
  return null;
};

Content.prototype.getChildren = function() {
  return Content.findAll({
    where: { parent_id: this.id, status: 'published' },
    order: [['menu_order', 'ASC'], ['title', 'ASC']]
  });
};

Content.prototype.incrementViewCount = async function() {
  this.view_count += 1;
  await this.save();
  return this;
};

Content.prototype.publish = async function() {
  this.status = 'published';
  this.published_at = new Date();
  await this.save();
  
  // Log publication
  const { logger } = require('../utils/logger');
  logger.info('Content published', {
    contentId: this.id,
    title: this.title,
    contentType: this.content_type,
    authorId: this.author_id
  });
  
  return this;
};

Content.prototype.unpublish = async function() {
  this.status = 'draft';
  this.published_at = null;
  await this.save();
  return this;
};

Content.prototype.archive = async function() {
  this.status = 'archived';
  await this.save();
  return this;
};

Content.prototype.getFullPath = async function() {
  const path = [this.slug];
  let current = this;
  
  while (current.parent_id) {
    current = await Content.findByPk(current.parent_id);
    if (current) {
      path.unshift(current.slug);
    } else {
      break;
    }
  }
  
  return path.join('/');
};

// Class methods
Content.findBySlug = function(slug) {
  return this.findOne({ where: { slug, status: 'published' } });
};

Content.getPublishedContent = function(contentType = null) {
  const whereClause = { status: 'published' };
  if (contentType) {
    whereClause.content_type = contentType;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['published_at', 'DESC']]
  });
};

Content.getContentByType = function(contentType) {
  return this.findAll({
    where: { content_type: contentType },
    order: [['created_at', 'DESC']]
  });
};

Content.getFeaturedContent = function(contentType = null) {
  const whereClause = { featured: true, status: 'published' };
  if (contentType) {
    whereClause.content_type = contentType;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['sort_order', 'ASC'], ['published_at', 'DESC']]
  });
};

Content.getMenuItems = function() {
  return this.findAll({
    where: { show_in_menu: true, status: 'published' },
    order: [['menu_order', 'ASC'], ['title', 'ASC']]
  });
};

Content.searchContent = function(query, contentType = null) {
  const whereClause = {
    status: 'published',
    [sequelize.Op.or]: [
      { title: { [sequelize.Op.like]: `%${query}%` } },
      { content: { [sequelize.Op.like]: `%${query}%` } },
      { excerpt: { [sequelize.Op.like]: `%${query}%` } }
    ]
  };
  
  if (contentType) {
    whereClause.content_type = contentType;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['published_at', 'DESC']]
  });
};

Content.getContentByTag = function(tag) {
  return this.findAll({
    where: {
      status: 'published',
      tags: {
        [sequelize.Op.contains]: [tag]
      }
    },
    order: [['published_at', 'DESC']]
  });
};

Content.getContentByCategory = function(categoryId) {
  return this.findAll({
    where: {
      status: 'published',
      categories: {
        [sequelize.Op.contains]: [categoryId]
      }
    },
    order: [['published_at', 'DESC']]
  });
};

Content.getRecentContent = function(limit = 10, contentType = null) {
  const whereClause = { status: 'published' };
  if (contentType) {
    whereClause.content_type = contentType;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['published_at', 'DESC']],
    limit
  });
};

Content.getPopularContent = function(limit = 10, contentType = null) {
  const whereClause = { status: 'published' };
  if (contentType) {
    whereClause.content_type = contentType;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['view_count', 'DESC']],
    limit
  });
};

Content.createContent = async function(contentData) {
  const content = await this.create(contentData);
  return content;
};

Content.updateContent = async function(id, updateData) {
  const content = await this.findByPk(id);
  if (!content) {
    throw new Error('Content not found');
  }

  await content.update(updateData);
  return content;
};

Content.deleteContent = async function(id) {
  const content = await this.findByPk(id);
  if (!content) {
    throw new Error('Content not found');
  }

  // Check if content has children
  const children = await content.getChildren();
  if (children.length > 0) {
    throw new Error('Cannot delete content with child pages');
  }

  await content.destroy();
  return true;
};

Content.getContentStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'content_type',
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['content_type', 'status']
  });
  
  return stats;
};

// Associations
Content.associate = function(models) {
  Content.belongsTo(models.User, {
    foreignKey: 'author_id',
    as: 'author'
  });
  
  Content.belongsTo(Content, {
    foreignKey: 'parent_id',
    as: 'parent'
  });
  
  Content.hasMany(Content, {
    foreignKey: 'parent_id',
    as: 'children'
  });
};

module.exports = Content; 