const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
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
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  product_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  path: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Category path like "Electronics > Phones > Smartphones"'
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
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (category) => {
      if (category.parent_id) {
        const parent = await Category.findByPk(category.parent_id);
        if (parent) {
          category.level = parent.level + 1;
          category.path = parent.path ? `${parent.path} > ${category.name}` : category.name;
        }
      } else {
        category.level = 0;
        category.path = category.name;
      }
    },
    beforeUpdate: async (category) => {
      if (category.changed('parent_id') || category.changed('name')) {
        if (category.parent_id) {
          const parent = await Category.findByPk(category.parent_id);
          if (parent) {
            category.level = parent.level + 1;
            category.path = parent.path ? `${parent.path} > ${category.name}` : category.name;
          }
        } else {
          category.level = 0;
          category.path = category.name;
        }
      }
    }
  }
});

// Instance methods
Category.prototype.getChildren = function() {
  return Category.findAll({
    where: { parent_id: this.id, status: 'active' },
    order: [['sort_order', 'ASC'], ['name', 'ASC']]
  });
};

Category.prototype.getParent = function() {
  return Category.findByPk(this.parent_id);
};

Category.prototype.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parent_id) {
    current = await Category.findByPk(current.parent_id);
    if (current) {
      ancestors.unshift(current);
    } else {
      break;
    }
  }
  
  return ancestors;
};

Category.prototype.getDescendants = async function() {
  const descendants = [];
  
  const getChildrenRecursive = async (categoryId) => {
    const children = await Category.findAll({
      where: { parent_id: categoryId, status: 'active' }
    });
    
    for (const child of children) {
      descendants.push(child);
      await getChildrenRecursive(child.id);
    }
  };
  
  await getChildrenRecursive(this.id);
  return descendants;
};

Category.prototype.updateProductCount = async function() {
  const { Product } = require('./Product');
  const count = await Product.count({
    where: { category_id: this.id, status: 'active' }
  });
  
  this.product_count = count;
  await this.save();
};

// Class methods
Category.getRootCategories = function() {
  return this.findAll({
    where: { parent_id: null, status: 'active' },
    order: [['sort_order', 'ASC'], ['name', 'ASC']]
  });
};

Category.getCategoryTree = async function() {
  const buildTree = async (parentId = null) => {
    const categories = await this.findAll({
      where: { parent_id: parentId, status: 'active' },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    const tree = [];
    for (const category of categories) {
      const children = await buildTree(category.id);
      tree.push({
        ...category.toJSON(),
        children
      });
    }
    
    return tree;
  };
  
  return buildTree();
};

Category.findBySlug = function(slug) {
  return this.findOne({ where: { slug, status: 'active' } });
};

Category.createCategory = async function(categoryData) {
  const category = await this.create(categoryData);
  return category;
};

Category.updateCategory = async function(id, updateData) {
  const category = await this.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }

  await category.update(updateData);
  return category;
};

Category.deleteCategory = async function(id) {
  const category = await this.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }

  // Check if category has children
  const children = await category.getChildren();
  if (children.length > 0) {
    throw new Error('Cannot delete category with subcategories');
  }

  // Check if category has products
  const { Product } = require('./Product');
  const productCount = await Product.count({
    where: { category_id: id }
  });
  
  if (productCount > 0) {
    throw new Error('Cannot delete category with products');
  }

  await category.destroy();
  return true;
};

module.exports = Category; 