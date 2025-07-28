const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  payment_method: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  payment_provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'stripe, paypal, bank_transfer, etc.'
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'AUD',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  gateway_response: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Raw response from payment gateway'
  },
  gateway_error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gateway_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  refunded_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  refunded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refunded_reason: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  payment_details: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Payment method details (masked card number, etc.)'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  retry_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  next_retry_at: {
    type: DataTypes.DATE,
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
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (payment) => {
      // Generate transaction ID if not provided
      if (!payment.transaction_id) {
        payment.transaction_id = await Payment.generateTransactionId();
      }
    }
  }
});

// Instance methods
Payment.prototype.getOrder = function() {
  const { Order } = require('./Order');
  return Order.findByPk(this.order_id);
};

Payment.prototype.getUser = function() {
  if (this.user_id) {
    const { User } = require('./User');
    return User.findByPk(this.user_id);
  }
  return null;
};

Payment.prototype.updateStatus = async function(newStatus, gatewayResponse = null, error = null) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Set timestamps based on status
  switch (newStatus) {
    case 'completed':
      this.processed_at = new Date();
      break;
    case 'failed':
      this.failed_at = new Date();
      if (error) this.gateway_error = error;
      break;
    case 'refunded':
    case 'partially_refunded':
      this.refunded_at = new Date();
      break;
  }
  
  if (gatewayResponse) {
    this.gateway_response = gatewayResponse;
  }
  
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Payment status changed', {
    paymentId: this.id,
    orderId: this.order_id,
    transactionId: this.transaction_id,
    oldStatus,
    newStatus,
    amount: this.amount,
    error
  });
  
  // Update order payment status
  const { Order } = require('./Order');
  const order = await Order.findByPk(this.order_id);
  if (order) {
    order.payment_status = newStatus;
    order.payment_transaction_id = this.transaction_id;
    await order.save();
  }
};

Payment.prototype.refund = async function(amount, reason = null) {
  if (amount > this.amount - this.refunded_amount) {
    throw new Error('Refund amount exceeds payment amount');
  }
  
  this.refunded_amount += amount;
  this.refunded_reason = reason;
  this.refunded_at = new Date();
  
  // Update status if fully refunded
  if (this.refunded_amount >= this.amount) {
    this.status = 'refunded';
  } else {
    this.status = 'partially_refunded';
  }
  
  await this.save();
  
  // Log refund
  const { logger } = require('../utils/logger');
  logger.info('Payment refunded', {
    paymentId: this.id,
    orderId: this.order_id,
    transactionId: this.transaction_id,
    refundAmount: amount,
    totalRefunded: this.refunded_amount,
    reason
  });
  
  return this;
};

Payment.prototype.getRemainingAmount = function() {
  return parseFloat(this.amount || 0) - parseFloat(this.refunded_amount || 0);
};

Payment.prototype.retry = async function() {
  this.retry_count += 1;
  this.next_retry_at = new Date(Date.now() + (this.retry_count * 5 * 60 * 1000)); // 5 minutes * retry count
  this.status = 'pending';
  await this.save();
  
  return this;
};

// Class methods
Payment.generateTransactionId = async function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const transactionId = `TXN-${timestamp}-${random}`.toUpperCase();
  
  // Check if transaction ID already exists
  const existing = await this.findOne({ where: { transaction_id: transactionId } });
  if (existing) {
    return this.generateTransactionId(); // Recursive call if duplicate
  }
  
  return transactionId;
};

Payment.findByTransactionId = function(transactionId) {
  return this.findOne({ where: { transaction_id: transactionId } });
};

Payment.getPaymentsByOrder = function(orderId) {
  return this.findAll({
    where: { order_id: orderId },
    order: [['created_at', 'DESC']]
  });
};

Payment.getPaymentsByUser = function(userId) {
  return this.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
};

Payment.getPaymentsByStatus = function(status) {
  return this.findAll({
    where: { status },
    order: [['created_at', 'DESC']]
  });
};

Payment.getPaymentsByProvider = function(provider) {
  return this.findAll({
    where: { payment_provider: provider },
    order: [['created_at', 'DESC']]
  });
};

Payment.getFailedPayments = function() {
  return this.findAll({
    where: { status: 'failed' },
    order: [['failed_at', 'DESC']]
  });
};

Payment.getPendingRetries = function() {
  return this.findAll({
    where: {
      status: 'failed',
      next_retry_at: {
        [sequelize.Op.lte]: new Date()
      }
    },
    order: [['next_retry_at', 'ASC']]
  });
};

Payment.getPaymentStats = async function(period = null) {
  const whereClause = {};
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const stats = await this.findAll({
    attributes: [
      'status',
      'payment_provider',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      [sequelize.fn('SUM', sequelize.col('gateway_fee')), 'total_fees']
    ],
    where: whereClause,
    group: ['status', 'payment_provider']
  });
  
  return stats;
};

Payment.createPayment = async function(paymentData) {
  const payment = await this.create(paymentData);
  return payment;
};

Payment.updatePayment = async function(id, updateData) {
  const payment = await this.findByPk(id);
  if (!payment) {
    throw new Error('Payment not found');
  }

  await payment.update(updateData);
  return payment;
};

Payment.deletePayment = async function(id) {
  const payment = await this.findByPk(id);
  if (!payment) {
    throw new Error('Payment not found');
  }

  // Check if payment can be deleted (only pending payments)
  if (payment.status !== 'pending') {
    throw new Error('Only pending payments can be deleted');
  }

  await payment.destroy();
  return true;
};

// Associations
Payment.associate = function(models) {
  Payment.belongsTo(models.Order, {
    foreignKey: 'order_id',
    as: 'order'
  });
  
  Payment.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Payment; 