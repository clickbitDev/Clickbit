const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  guest_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 'confirmed', 'processing', 'shipped', 
      'delivered', 'cancelled', 'refunded', 'partially_refunded'
    ),
    defaultValue: 'pending',
    allowNull: false
  },
  subtotal: {
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
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
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
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'AUD',
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payment_transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  shipping_method: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  shipping_tracking_number: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  shipping_carrier: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  customer_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coupon_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  coupon_discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  items_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  weight_total: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  estimated_delivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelled_reason: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  refunded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refunded_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  refunded_reason: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
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
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (order) => {
      // Generate order number if not provided
      if (!order.order_number) {
        order.order_number = await Order.generateOrderNumber();
      }
      
      // Calculate total if not provided
      if (!order.total_amount) {
        order.total_amount = (
          parseFloat(order.subtotal || 0) +
          parseFloat(order.tax_amount || 0) +
          parseFloat(order.shipping_amount || 0) -
          parseFloat(order.discount_amount || 0) -
          parseFloat(order.coupon_discount || 0)
        );
      }
    },
    beforeUpdate: async (order) => {
      // Recalculate total if any amount fields changed
      if (order.changed('subtotal') || order.changed('tax_amount') || 
          order.changed('shipping_amount') || order.changed('discount_amount') || 
          order.changed('coupon_discount')) {
        order.total_amount = (
          parseFloat(order.subtotal || 0) +
          parseFloat(order.tax_amount || 0) +
          parseFloat(order.shipping_amount || 0) -
          parseFloat(order.discount_amount || 0) -
          parseFloat(order.coupon_discount || 0)
        );
      }
    }
  }
});

// Instance methods
Order.prototype.getItems = function() {
  const { OrderItem } = require('./OrderItem');
  return OrderItem.findAll({
    where: { order_id: this.id },
    include: [{ model: require('./Product'), as: 'product' }]
  });
};

Order.prototype.getCustomer = function() {
  if (this.user_id) {
    const { User } = require('./User');
    return User.findByPk(this.user_id);
  }
  return null;
};

Order.prototype.updateStatus = async function(newStatus, notes = null) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Set timestamp based on status
  switch (newStatus) {
    case 'shipped':
      this.shipped_at = new Date();
      break;
    case 'delivered':
      this.delivered_at = new Date();
      break;
    case 'cancelled':
      this.cancelled_at = new Date();
      if (notes) this.cancelled_reason = notes;
      break;
    case 'refunded':
    case 'partially_refunded':
      this.refunded_at = new Date();
      if (notes) this.refunded_reason = notes;
      break;
  }
  
  if (notes) {
    this.admin_notes = this.admin_notes ? `${this.admin_notes}\n${new Date().toISOString()}: ${notes}` : notes;
  }
  
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Order status changed', {
    orderId: this.id,
    orderNumber: this.order_number,
    oldStatus,
    newStatus,
    notes
  });
};

Order.prototype.calculateTotals = async function() {
  const { OrderItem } = require('./OrderItem');
  const items = await OrderItem.findAll({
    where: { order_id: this.id }
  });
  
  let subtotal = 0;
  let itemsCount = 0;
  let weightTotal = 0;
  
  for (const item of items) {
    subtotal += parseFloat(item.total_price || 0);
    itemsCount += parseInt(item.quantity || 0);
    weightTotal += parseFloat(item.weight || 0) * parseInt(item.quantity || 0);
  }
  
  this.subtotal = subtotal;
  this.items_count = itemsCount;
  this.weight_total = weightTotal;
  
  // Recalculate total
  this.total_amount = (
    subtotal +
    parseFloat(this.tax_amount || 0) +
    parseFloat(this.shipping_amount || 0) -
    parseFloat(this.discount_amount || 0) -
    parseFloat(this.coupon_discount || 0)
  );
  
  await this.save();
  return this;
};

// Class methods
Order.generateOrderNumber = async function() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Get count of orders for today
  const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  
  const count = await this.count({
    where: {
      created_at: {
        [sequelize.Op.gte]: todayStart,
        [sequelize.Op.lt]: todayEnd
      }
    }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `ORD-${year}${month}${day}-${sequence}`;
};

Order.findByOrderNumber = function(orderNumber) {
  return this.findOne({ where: { order_number: orderNumber } });
};

Order.getOrdersByUser = function(userId) {
  return this.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
};

Order.getOrdersByStatus = function(status) {
  return this.findAll({
    where: { status },
    order: [['created_at', 'DESC']]
  });
};

Order.getRecentOrders = function(limit = 10) {
  return this.findAll({
    order: [['created_at', 'DESC']],
    limit
  });
};

Order.getOrderStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
    ],
    group: ['status']
  });
  
  return stats;
};

Order.createOrder = async function(orderData) {
  const order = await this.create(orderData);
  return order;
};

Order.updateOrder = async function(id, updateData) {
  const order = await this.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }

  await order.update(updateData);
  return order;
};

Order.deleteOrder = async function(id) {
  const order = await this.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }

  // Check if order can be deleted (only pending orders)
  if (order.status !== 'pending') {
    throw new Error('Only pending orders can be deleted');
  }

  await order.destroy();
  return true;
};

module.exports = Order; 