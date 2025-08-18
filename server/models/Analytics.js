const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  event_type: {
    type: DataTypes.ENUM('page_view', 'click', 'form_submit', 'purchase', 'signup', 'login', 'search', 'download', 'custom'),
    allowNull: false
  },
  event_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  session_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  page_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  page_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  referrer_url: {
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
  device_type: {
    type: DataTypes.ENUM('desktop', 'mobile', 'tablet', 'other'),
    allowNull: true
  },
  browser: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  browser_version: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  operating_system: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  os_version: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  utm_source: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  utm_medium: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  utm_campaign: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  utm_term: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  utm_content: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  event_data: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional event-specific data'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monetary value associated with the event'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'AUD',
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  scroll_depth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Scroll depth percentage (0-100)'
  },
  time_on_page: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time spent on page in seconds'
  },
  exit_page: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bounce: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  conversion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  conversion_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'analytics',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['event_type', 'created_at']
    },
    {
      fields: ['user_id', 'created_at']
    },
    {
      fields: ['session_id', 'created_at']
    },
    {
      fields: ['page_url', 'created_at']
    },
    {
      fields: ['utm_source', 'created_at']
    },
    {
      fields: ['country', 'created_at']
    }
  ]
});

// Instance methods
Analytics.prototype.getUser = function() {
  if (this.user_id) {
    const { User } = require('./User');
    return User.findByPk(this.user_id);
  }
  return null;
};

Analytics.prototype.getSessionEvents = function() {
  return Analytics.findAll({
    where: { session_id: this.session_id },
    order: [['created_at', 'ASC']]
  });
};

Analytics.prototype.getUserEvents = function() {
  if (!this.user_id) return [];
  
  return Analytics.findAll({
    where: { user_id: this.user_id },
    order: [['created_at', 'DESC']]
  });
};

// Class methods
Analytics.trackEvent = async function(eventData) {
  const analytics = await this.create(eventData);
  
  // Log analytics event
  const { logger } = require('../utils/logger');
  logger.info('Analytics event tracked', {
    eventType: analytics.event_type,
    eventName: analytics.event_name,
    userId: analytics.user_id,
    sessionId: analytics.session_id,
    pageUrl: analytics.page_url
  });
  
  return analytics;
};

Analytics.getPageViews = function(pageUrl = null, period = null) {
  const whereClause = { event_type: 'page_view' };
  
  if (pageUrl) {
    whereClause.page_url = pageUrl;
  }
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  return this.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']]
  });
};

Analytics.getEventsByType = function(eventType, period = null) {
  const whereClause = { event_type: eventType };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  return this.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']]
  });
};

Analytics.getUserEvents = function(userId, period = null) {
  const whereClause = { user_id: userId };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  return this.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']]
  });
};

Analytics.getSessionEvents = function(sessionId) {
  return this.findAll({
    where: { session_id: sessionId },
    order: [['created_at', 'ASC']]
  });
};

Analytics.getTopPages = async function(limit = 10, period = null) {
  const whereClause = { event_type: 'page_view' };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'page_url',
      'page_title',
      [sequelize.fn('COUNT', sequelize.col('id')), 'views'],
      [sequelize.fn('AVG', sequelize.col('time_on_page')), 'avg_time'],
      [sequelize.fn('COUNT', sequelize.literal('CASE WHEN bounce = true THEN 1 END')), 'bounces']
    ],
    where: whereClause,
    group: ['page_url', 'page_title'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    limit
  });
  
  return results;
};

Analytics.getTopReferrers = async function(limit = 10, period = null) {
  const whereClause = { 
    event_type: 'page_view',
    referrer_url: {
      [sequelize.Op.ne]: null
    }
  };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'referrer_url',
      [sequelize.fn('COUNT', sequelize.col('id')), 'visits']
    ],
    where: whereClause,
    group: ['referrer_url'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    limit
  });
  
  return results;
};

Analytics.getTopCountries = async function(limit = 10, period = null) {
  const whereClause = { 
    event_type: 'page_view',
    country: {
      [sequelize.Op.ne]: null
    }
  };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'country',
      [sequelize.fn('COUNT', sequelize.col('id')), 'visits']
    ],
    where: whereClause,
    group: ['country'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    limit
  });
  
  return results;
};

Analytics.getDeviceStats = async function(period = null) {
  const whereClause = { 
    event_type: 'page_view',
    device_type: {
      [sequelize.Op.ne]: null
    }
  };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'device_type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'visits']
    ],
    where: whereClause,
    group: ['device_type'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
  });
  
  return results;
};

Analytics.getBrowserStats = async function(period = null) {
  const whereClause = { 
    event_type: 'page_view',
    browser: {
      [sequelize.Op.ne]: null
    }
  };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'browser',
      'browser_version',
      [sequelize.fn('COUNT', sequelize.col('id')), 'visits']
    ],
    where: whereClause,
    group: ['browser', 'browser_version'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
  });
  
  return results;
};

Analytics.getConversionStats = async function(period = null) {
  const whereClause = { conversion: true };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'event_type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'conversions'],
      [sequelize.fn('SUM', sequelize.col('conversion_value')), 'total_value']
    ],
    where: whereClause,
    group: ['event_type'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
  });
  
  return results;
};

Analytics.getUTMStats = async function(period = null) {
  const whereClause = { 
    event_type: 'page_view',
    utm_source: {
      [sequelize.Op.ne]: null
    }
  };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const results = await this.findAll({
    attributes: [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      [sequelize.fn('COUNT', sequelize.col('id')), 'visits']
    ],
    where: whereClause,
    group: ['utm_source', 'utm_medium', 'utm_campaign'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
  });
  
  return results;
};

Analytics.getDailyStats = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const results = await this.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'events'],
      [sequelize.fn('COUNT', sequelize.literal('DISTINCT session_id')), 'sessions'],
      [sequelize.fn('COUNT', sequelize.literal('DISTINCT user_id')), 'users']
    ],
    where: {
      created_at: {
        [sequelize.Op.gte]: startDate
      }
    },
    group: [sequelize.fn('DATE', sequelize.col('created_at'))],
    order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
  });
  
  return results;
};

Analytics.getBounceRate = async function(period = null) {
  const whereClause = { event_type: 'page_view' };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const total = await this.count({
    where: whereClause
  });
  
  const bounces = await this.count({
    where: {
      ...whereClause,
      bounce: true
    }
  });
  
  return total > 0 ? (bounces / total) * 100 : 0;
};

Analytics.getAverageSessionDuration = async function(period = null) {
  const whereClause = { 
    event_type: 'page_view',
    duration: {
      [sequelize.Op.ne]: null
    }
  };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const result = await this.findOne({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('duration')), 'avg_duration']
    ],
    where: whereClause
  });
  
  return result ? parseFloat(result.getDataValue('avg_duration')) : 0;
};

Analytics.getUniqueVisitors = async function(period = null) {
  const whereClause = { event_type: 'page_view' };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  return this.count({
    where: whereClause,
    distinct: true,
    col: 'user_id'
  });
};

Analytics.getReturningVisitors = async function(period = null) {
  const whereClause = { event_type: 'page_view' };
  
  if (period) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    whereClause.created_at = {
      [sequelize.Op.gte]: startDate
    };
  }
  
  const userCounts = await this.findAll({
    attributes: [
      'user_id',
      [sequelize.fn('COUNT', sequelize.col('id')), 'visit_count']
    ],
    where: whereClause,
    group: ['user_id'],
    having: sequelize.literal('COUNT(id) > 1')
  });
  
  return userCounts.length;
};

// Associations
Analytics.associate = function(models) {
  Analytics.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Analytics; 