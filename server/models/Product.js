const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  compare_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '{"length": 10, "width": 5, "height": 2}'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of image URLs'
  },
  featured_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5,
    validate: {
      min: 0
    }
  },
  track_inventory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allow_backorders: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  attributes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Product attributes like color, size, etc.'
  },
  variants: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Product variants with different prices/attributes'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of tag strings'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  review_count: {
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
  sales_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
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
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['sku']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['featured']
    },
    {
      fields: ['price']
    }
  ]
});

// Instance methods
Product.prototype.isInStock = function() {
  if (!this.track_inventory) return true;
  return this.stock_quantity > 0;
};

Product.prototype.isLowStock = function() {
  if (!this.track_inventory) return false;
  return this.stock_quantity <= this.low_stock_threshold;
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.compare_price || this.compare_price <= this.price) return 0;
  return Math.round(((this.compare_price - this.price) / this.compare_price) * 100);
};

Product.prototype.getProfitMargin = function() {
  if (!this.cost_price) return null;
  return ((this.price - this.cost_price) / this.price) * 100;
};

Product.prototype.incrementViewCount = async function() {
  this.view_count += 1;
  await this.save();
};

Product.prototype.incrementSalesCount = async function(quantity = 1) {
  this.sales_count += quantity;
  if (this.track_inventory) {
    this.stock_quantity = Math.max(0, this.stock_quantity - quantity);
  }
  await this.save();
};

Product.prototype.updateRating = async function(newRating) {
  const totalRating = (this.rating * this.review_count) + newRating;
  this.review_count += 1;
  this.rating = totalRating / this.review_count;
  await this.save();
};

// Class methods
Product.findBySlug = function(slug) {
  return this.findOne({ 
    where: { slug, status: 'active' },
    include: ['category']
  });
};

Product.findByCategory = function(categoryId, options = {}) {
  const defaultOptions = {
    where: { 
      category_id: categoryId,
      status: 'active'
    },
    order: [['sort_order', 'ASC'], ['name', 'ASC']]
  };
  
  return this.findAll({ ...defaultOptions, ...options });
};

Product.findFeatured = function(limit = 10) {
  return this.findAll({
    where: { 
      featured: true,
      status: 'active'
    },
    order: [['sort_order', 'ASC']],
    limit
  });
};

Product.search = function(query, options = {}) {
  const defaultOptions = {
    where: {
      status: 'active',
      [Op.or]: [
        { name: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
        { tags: { [Op.like]: `%${query}%` } }
      ]
    },
    order: [['name', 'ASC']]
  };
  
  return this.findAll({ ...defaultOptions, ...options });
};

Product.getLowStockProducts = function() {
  return this.findAll({
    where: {
      track_inventory: true,
      stock_quantity: {
        [Op.lte]: sequelize.col('low_stock_threshold')
      }
    },
    order: [['stock_quantity', 'ASC']]
  });
};

// Scopes
Product.addScope('active', {
  where: { status: 'active' }
});

Product.addScope('featured', {
  where: { featured: true, status: 'active' }
});

Product.addScope('inStock', {
  where: {
    [Op.or]: [
      { track_inventory: false },
      { stock_quantity: { [Op.gt]: 0 } }
    ]
  }
});

Product.addScope('withCategory', {
  include: ['category']
});

Product.addScope('withImages', {
  where: {
    featured_image: {
      [Op.ne]: null
    }
  }
});

// Hooks
Product.beforeCreate(async (product) => {
  if (!product.slug) {
    product.slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

Product.beforeUpdate(async (product) => {
  if (product.changed('name') && !product.changed('slug')) {
    product.slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

module.exports = Product; 