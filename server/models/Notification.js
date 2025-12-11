const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
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
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    defaultValue: 'info',
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'system',
    comment: 'Source of notification (uptime-kuma, system, etc.)'
  },
  monitor_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Name of the monitor (for Uptime Kuma notifications)'
  },
  monitor_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL of the monitor (for Uptime Kuma notifications)'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Status from Uptime Kuma (up, down, etc.)'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional metadata from webhook payload'
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
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Instance methods
Notification.prototype.markAsRead = async function() {
  this.is_read = true;
  this.read_at = new Date();
  await this.save();
  return this;
};

module.exports = Notification;

