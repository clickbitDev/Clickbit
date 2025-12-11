const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  headerImage: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'header_image',
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  sections: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_popular',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'services',
  timestamps: true,
});

module.exports = Service; 