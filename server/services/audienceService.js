const { Analytics } = require('../models');
const { logger } = require('../utils/logger');

class AudienceService {
  constructor() {
    this.audienceDefinitions = {
      'high_value_visitors': {
        name: 'High-Value Visitors',
        description: 'Users who visit pricing or services pages multiple times',
        conditions: {
          page_url_contains: ['/services', '/pricing', '/get-started'],
          min_sessions: 2,
          time_period_days: 30
        }
      },
      'contact_form_submitters': {
        name: 'Contact Form Submitters',
        description: 'Users who have submitted contact forms',
        conditions: {
          event_name: 'form_submit',
          time_period_days: 90
        }
      },
      'return_visitors': {
        name: 'Return Visitors',
        description: 'Users with multiple sessions',
        conditions: {
          min_sessions: 3,
          time_period_days: 30
        }
      },
      'mobile_users': {
        name: 'Mobile Users',
        description: 'Users primarily on mobile devices',
        conditions: {
          device_type: 'mobile',
          min_sessions: 1,
          time_period_days: 30
        }
      },
      'engaged_visitors': {
        name: 'Engaged Visitors',
        description: 'Users with high engagement (long time on site, deep scroll)',
        conditions: {
          min_time_on_page: 120, // 2 minutes
          min_scroll_depth: 75,
          time_period_days: 30
        }
      },
      'conversion_prospects': {
        name: 'Conversion Prospects',
        description: 'Users who showed purchase intent but didn\'t convert',
        conditions: {
          events_include: ['view_item', 'add_to_cart'],
          events_exclude: ['purchase'],
          time_period_days: 7
        }
      }
    };
  }

  async getAudienceUsers(audienceType, limit = 1000) {
    const definition = this.audienceDefinitions[audienceType];
    if (!definition) {
      throw new Error(`Unknown audience type: ${audienceType}`);
    }

    const { conditions } = definition;
    const { Op } = require('sequelize');
    const { sequelize } = require('../config/database');

    try {
      let whereClause = {};
      let havingClause = null;

      // Time period filter
      if (conditions.time_period_days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - conditions.time_period_days);
        whereClause.created_at = { [Op.gte]: startDate };
      }

      // Build query based on audience type
      switch (audienceType) {
        case 'high_value_visitors':
          const users = await Analytics.findAll({
            attributes: [
              'user_id',
              [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('session_id'))), 'session_count']
            ],
            where: {
              ...whereClause,
              event_type: 'page_view',
              page_url: {
                [Op.or]: conditions.page_url_contains.map(url => ({ [Op.like]: `%${url}%` }))
              },
              user_id: { [Op.ne]: null }
            },
            group: ['user_id'],
            having: sequelize.literal(`COUNT(DISTINCT session_id) >= ${conditions.min_sessions}`),
            limit
          });
          return users;

        case 'contact_form_submitters':
          return await Analytics.findAll({
            attributes: ['user_id', 'session_id', 'ip_address'],
            where: {
              ...whereClause,
              event_name: conditions.event_name
            },
            group: ['user_id', 'session_id', 'ip_address'],
            limit
          });

        case 'return_visitors':
          return await Analytics.findAll({
            attributes: [
              'user_id',
              [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('session_id'))), 'session_count']
            ],
            where: {
              ...whereClause,
              event_type: 'page_view',
              user_id: { [Op.ne]: null }
            },
            group: ['user_id'],
            having: sequelize.literal(`COUNT(DISTINCT session_id) >= ${conditions.min_sessions}`),
            limit
          });

        case 'mobile_users':
          return await Analytics.findAll({
            attributes: ['user_id', 'session_id', 'ip_address'],
            where: {
              ...whereClause,
              device_type: conditions.device_type,
              event_type: 'page_view'
            },
            group: ['user_id', 'session_id', 'ip_address'],
            limit
          });

        case 'engaged_visitors':
          return await Analytics.findAll({
            attributes: ['user_id', 'session_id'],
            where: {
              ...whereClause,
              event_type: 'page_view',
              time_on_page: { [Op.gte]: conditions.min_time_on_page },
              scroll_depth: { [Op.gte]: conditions.min_scroll_depth }
            },
            group: ['user_id', 'session_id'],
            limit
          });

        case 'conversion_prospects':
          // Users who viewed items or added to cart but didn't purchase
          const prospects = await sequelize.query(`
            SELECT DISTINCT user_id, session_id 
            FROM analytics 
            WHERE created_at >= :startDate
              AND (event_name IN ('view_item', 'add_to_cart'))
              AND user_id NOT IN (
                SELECT DISTINCT user_id 
                FROM analytics 
                WHERE event_name = 'purchase' 
                  AND created_at >= :startDate
                  AND user_id IS NOT NULL
              )
              AND user_id IS NOT NULL
            LIMIT :limit
          `, {
            replacements: {
              startDate: whereClause.created_at?.[Op.gte] || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              limit
            },
            type: sequelize.QueryTypes.SELECT
          });
          return prospects;

        default:
          throw new Error(`Audience type ${audienceType} not implemented`);
      }

    } catch (error) {
      logger.error(`Error getting audience ${audienceType}:`, error);
      throw error;
    }
  }

  async getAudienceStats() {
    const stats = {};
    
    for (const [audienceType, definition] of Object.entries(this.audienceDefinitions)) {
      try {
        const users = await this.getAudienceUsers(audienceType, 10000);
        stats[audienceType] = {
          name: definition.name,
          description: definition.description,
          count: users.length,
          conditions: definition.conditions
        };
      } catch (error) {
        logger.error(`Error getting stats for audience ${audienceType}:`, error);
        stats[audienceType] = {
          name: definition.name,
          description: definition.description,
          count: 0,
          error: error.message
        };
      }
    }

    return stats;
  }

  // Generate audience export for Google Ads Customer Match
  async exportAudienceForGoogleAds(audienceType, format = 'email') {
    const users = await this.getAudienceUsers(audienceType);
    
    if (format === 'email') {
      // This would require user email data - you'd need to join with User model
      const { User } = require('../models');
      const userIds = users.map(u => u.user_id).filter(id => id);
      
      if (userIds.length > 0) {
        const userEmails = await User.findAll({
          attributes: ['email'],
          where: {
            id: userIds
          }
        });
        
        return userEmails.map(u => u.email);
      }
    }
    
    return [];
  }
}

module.exports = new AudienceService();
