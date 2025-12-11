const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SiteSetting = sequelize.define('SiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  setting_key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 255]
    }
  },
  setting_value: {
    type: DataTypes.JSON,
    allowNull: true
  },
  setting_type: {
    type: DataTypes.ENUM('marketing', 'billing', 'site_identity', 'navigation', 'content', 'system'),
    allowNull: false,
    defaultValue: 'system'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether this setting can be accessed by public API'
  },
  auto_load: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether to auto-load this setting on app initialization'
  }
}, {
  tableName: 'site_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SiteSetting;