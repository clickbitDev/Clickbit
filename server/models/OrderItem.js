const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  product_sku: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  product_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
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
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  variant_data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Selected variant options like color, size, etc.'
  },
  custom_options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Custom product options or modifications'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  refunded_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  refunded_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  refunded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refunded_reason: {
    type: DataTypes.STRING(500),
    allowNull: true
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
  tableName: 'order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (orderItem) => {
      // Calculate total price if not provided
      if (!orderItem.total_price) {
        orderItem.total_price = (
          parseFloat(orderItem.unit_price || 0) * parseInt(orderItem.quantity || 1) -
          parseFloat(orderItem.discount_amount || 0) +
          parseFloat(orderItem.tax_amount || 0)
        );
      }
    },
    beforeUpdate: async (orderItem) => {
      // Recalculate total if any price fields changed
      if (orderItem.changed('unit_price') || orderItem.changed('quantity') || 
          orderItem.changed('discount_amount') || orderItem.changed('tax_amount')) {
        orderItem.total_price = (
          parseFloat(orderItem.unit_price || 0) * parseInt(orderItem.quantity || 1) -
          parseFloat(orderItem.discount_amount || 0) +
          parseFloat(orderItem.tax_amount || 0)
        );
      }
    }
  }
});

// Instance methods
OrderItem.prototype.getProduct = function() {
  const { Product } = require('./Product');
  return Product.findByPk(this.product_id);
};

OrderItem.prototype.getOrder = function() {
  const { Order } = require('./Order');
  return Order.findByPk(this.order_id);
};

OrderItem.prototype.updateStatus = async function(newStatus, notes = null) {
  this.status = newStatus;
  
  if (newStatus === 'refunded') {
    this.refunded_at = new Date();
    if (notes) this.refunded_reason = notes;
  }
  
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Order item status changed', {
    orderItemId: this.id,
    orderId: this.order_id,
    productId: this.product_id,
    oldStatus: this.status,
    newStatus,
    notes
  });
};

OrderItem.prototype.refund = async function(quantity, amount, reason = null) {
  if (quantity > this.quantity - this.refunded_quantity) {
    throw new Error('Refund quantity exceeds available quantity');
  }
  
  if (amount > this.total_price - this.refunded_amount) {
    throw new Error('Refund amount exceeds item total');
  }
  
  this.refunded_quantity += quantity;
  this.refunded_amount += amount;
  this.refunded_reason = reason;
  this.refunded_at = new Date();
  
  // Update status if fully refunded
  if (this.refunded_quantity >= this.quantity) {
    this.status = 'refunded';
  }
  
  await this.save();
  
  // Update order totals
  const { Order } = require('./Order');
  const order = await Order.findByPk(this.order_id);
  if (order) {
    await order.calculateTotals();
  }
  
  return this;
};

OrderItem.prototype.getRemainingQuantity = function() {
  return this.quantity - this.refunded_quantity;
};

OrderItem.prototype.getRemainingAmount = function() {
  return parseFloat(this.total_price || 0) - parseFloat(this.refunded_amount || 0);
};

// Class methods
OrderItem.getItemsByOrder = function(orderId) {
  return this.findAll({
    where: { order_id: orderId },
    include: [{ model: require('./Product'), as: 'product' }],
    order: [['created_at', 'ASC']]
  });
};

OrderItem.getItemsByProduct = function(productId) {
  return this.findAll({
    where: { product_id: productId },
    include: [{ model: require('./Order'), as: 'order' }],
    order: [['created_at', 'DESC']]
  });
};

OrderItem.getRefundedItems = function() {
  return this.findAll({
    where: {
      refunded_quantity: {
        [sequelize.Op.gt]: 0
      }
    },
    include: [
      { model: require('./Product'), as: 'product' },
      { model: require('./Order'), as: 'order' }
    ],
    order: [['refunded_at', 'DESC']]
  });
};

OrderItem.getTopSellingProducts = async function(limit = 10, period = null) {
  const whereClause = {};
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'product_id',
      'product_name',
      [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
      [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue']
    ],
    where: whereClause,
    group: ['product_id', 'product_name'],
    order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
    limit
  });
  
  return results;
};

OrderItem.createOrderItem = async function(orderItemData) {
  const orderItem = await this.create(orderItemData);
  return orderItem;
};

OrderItem.updateOrderItem = async function(id, updateData) {
  const orderItem = await this.findByPk(id);
  if (!orderItem) {
    throw new Error('Order item not found');
  }

  await orderItem.update(updateData);
  return orderItem;
};

OrderItem.deleteOrderItem = async function(id) {
  const orderItem = await this.findByPk(id);
  if (!orderItem) {
    throw new Error('Order item not found');
  }

  // Check if order item can be deleted
  if (orderItem.status !== 'pending') {
    throw new Error('Only pending order items can be deleted');
  }

  await orderItem.destroy();
  
  // Update order totals
  const { Order } = require('./Order');
  const order = await Order.findByPk(orderItem.order_id);
  if (order) {
    await order.calculateTotals();
  }
  
  return true;
};

// Associations
OrderItem.associate = function(models) {
  OrderItem.belongsTo(models.Order, {
    foreignKey: 'order_id',
    as: 'order'
  });
  
  OrderItem.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

module.exports = OrderItem; 