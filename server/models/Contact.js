const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
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
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[\+]?[0-9][\d]{0,15}$/
    }
  },
  subject: {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Review rating (1-5 stars)'
  },
  contact_type: {
    type: DataTypes.ENUM('general', 'support', 'sales', 'feedback', 'complaint', 'partnership', 'other', 'review'),
    defaultValue: 'general',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'in_progress', 'replied', 'resolved', 'closed', 'pending', 'approved', 'rejected'),
    defaultValue: 'new',
    allowNull: false
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
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
  company: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  custom_fields: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional form fields'
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Contact form source (website, mobile app, etc.)'
  },
  referrer: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Referrer URL'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  replied_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of tag strings for categorization'
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
  tableName: 'contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Instance methods
Contact.prototype.getAssignedUser = function() {
  if (this.assigned_to) {
    const { User } = require('./User');
    return User.findByPk(this.assigned_to);
  }
  return null;
};

Contact.prototype.getUser = function() {
  if (this.user_id) {
    const { User } = require('./User');
    return User.findByPk(this.user_id);
  }
  return null;
};

Contact.prototype.markAsRead = async function() {
  this.status = 'read';
  this.read_at = new Date();
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Contact marked as read', {
    contactId: this.id,
    subject: this.subject,
    email: this.email
  });
  
  return this;
};

Contact.prototype.markAsReplied = async function() {
  this.status = 'replied';
  this.replied_at = new Date();
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Contact marked as replied', {
    contactId: this.id,
    subject: this.subject,
    email: this.email
  });
  
  return this;
};

Contact.prototype.markAsResolved = async function() {
  this.status = 'resolved';
  this.resolved_at = new Date();
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Contact marked as resolved', {
    contactId: this.id,
    subject: this.subject,
    email: this.email
  });
  
  return this;
};

Contact.prototype.close = async function() {
  this.status = 'closed';
  this.closed_at = new Date();
  await this.save();
  
  // Log status change
  const { logger } = require('../utils/logger');
  logger.info('Contact closed', {
    contactId: this.id,
    subject: this.subject,
    email: this.email
  });
  
  return this;
};

Contact.prototype.assignTo = async function(userId) {
  this.assigned_to = userId;
  await this.save();
  
  // Log assignment
  const { logger } = require('../utils/logger');
  logger.info('Contact assigned', {
    contactId: this.id,
    subject: this.subject,
    assignedTo: userId
  });
  
  return this;
};

Contact.prototype.addNote = async function(note) {
  const timestamp = new Date().toISOString();
  this.admin_notes = this.admin_notes 
    ? `${this.admin_notes}\n${timestamp}: ${note}`
    : `${timestamp}: ${note}`;
  
  await this.save();
  return this;
};

Contact.prototype.addTag = async function(tag) {
  if (!this.tags) {
    this.tags = [];
  }
  
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    await this.save();
  }
  
  return this;
};

Contact.prototype.removeTag = async function(tag) {
  if (this.tags && this.tags.includes(tag)) {
    this.tags = this.tags.filter(t => t !== tag);
    await this.save();
  }
  
  return this;
};

// Class methods
Contact.getNewContacts = function() {
  return this.findAll({
    where: { status: 'new' },
    order: [['created_at', 'DESC']]
  });
};

Contact.getContactsByStatus = function(status) {
  return this.findAll({
    where: { status },
    order: [['created_at', 'DESC']]
  });
};

Contact.getContactsByType = function(contactType) {
  return this.findAll({
    where: { contact_type: contactType },
    order: [['created_at', 'DESC']]
  });
};

Contact.getContactsByPriority = function(priority) {
  return this.findAll({
    where: { priority },
    order: [['created_at', 'DESC']]
  });
};

Contact.getContactsByUser = function(userId) {
  return this.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
};

Contact.getAssignedContacts = function(userId) {
  return this.findAll({
    where: { assigned_to: userId },
    order: [['created_at', 'DESC']]
  });
};

Contact.getUnassignedContacts = function() {
  return this.findAll({
    where: { assigned_to: null },
    order: [['created_at', 'DESC']]
  });
};

Contact.getContactsByTag = function(tag) {
  return this.findAll({
    where: {
      tags: {
        [sequelize.Op.contains]: [tag]
      }
    },
    order: [['created_at', 'DESC']]
  });
};

Contact.searchContacts = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.like]: `%${query}%` } },
        { email: { [sequelize.Op.like]: `%${query}%` } },
        { subject: { [sequelize.Op.like]: `%${query}%` } },
        { message: { [sequelize.Op.like]: `%${query}%` } },
        { company: { [sequelize.Op.like]: `%${query}%` } }
      ]
    },
    order: [['created_at', 'DESC']]
  });
};

Contact.getRecentContacts = function(limit = 10) {
  return this.findAll({
    order: [['created_at', 'DESC']],
    limit
  });
};

Contact.getContactStats = async function(period = null) {
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
      'contact_type',
      'priority',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: whereClause,
    group: ['status', 'contact_type', 'priority']
  });
  
  return stats;
};

Contact.getUnreadCount = function() {
  return this.count({
    where: { status: 'new' }
  });
};

Contact.getOverdueContacts = function(hours = 24) {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - hours);
  
  return this.findAll({
    where: {
      status: 'new',
      created_at: {
        [sequelize.Op.lt]: cutoffDate
      }
    },
    order: [['created_at', 'ASC']]
  });
};

Contact.createContact = async function(contactData) {
  const contact = await this.create(contactData);
  
  // Log new contact
  const { logger } = require('../utils/logger');
  logger.info('New contact received', {
    contactId: contact.id,
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    contactType: contact.contact_type,
    priority: contact.priority
  });
  
  return contact;
};

Contact.updateContact = async function(id, updateData) {
  const contact = await this.findByPk(id);
  if (!contact) {
    throw new Error('Contact not found');
  }

  await contact.update(updateData);
  return contact;
};

Contact.deleteContact = async function(id) {
  const contact = await this.findByPk(id);
  if (!contact) {
    throw new Error('Contact not found');
  }

  await contact.destroy();
  return true;
};

// Associations
Contact.associate = function(models) {
  Contact.belongsTo(models.User, {
    foreignKey: 'assigned_to',
    as: 'assignedUser'
  });
  
  Contact.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Contact; 