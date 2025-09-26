const { Analytics } = require('../models');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class AnalyticsAlerts {
  constructor() {
    this.alertRules = {
      'traffic_spike': {
        name: 'Traffic Spike Alert',
        condition: 'traffic_increase_percent > 200',
        threshold: 200,
        enabled: true
      },
      'traffic_drop': {
        name: 'Traffic Drop Alert', 
        condition: 'traffic_decrease_percent > 50',
        threshold: 50,
        enabled: true
      },
      'conversion_drop': {
        name: 'Conversion Drop Alert',
        condition: 'conversion_rate_drop > 30',
        threshold: 30,
        enabled: true
      },
      'high_bounce_rate': {
        name: 'High Bounce Rate Alert',
        condition: 'bounce_rate > 80',
        threshold: 80,
        enabled: true
      },
      'server_errors': {
        name: 'Server Error Spike',
        condition: 'error_rate > 5',
        threshold: 5,
        enabled: true
      }
    };
  }

  async checkTrafficAlerts() {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastWeekSameDay = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get today's traffic
      const todayTraffic = await Analytics.count({
        where: {
          event_type: 'page_view',
          created_at: {
            [Op.gte]: yesterday
          }
        }
      });

      // Get last week same day traffic
      const lastWeekTraffic = await Analytics.count({
        where: {
          event_type: 'page_view',
          created_at: {
            [Op.between]: [
              new Date(lastWeekSameDay.getTime() - 24 * 60 * 60 * 1000),
              lastWeekSameDay
            ]
          }
        }
      });

      const alerts = [];

      if (lastWeekTraffic > 0) {
        const changePercent = ((todayTraffic - lastWeekTraffic) / lastWeekTraffic) * 100;

        // Traffic spike alert
        if (changePercent > this.alertRules.traffic_spike.threshold) {
          alerts.push({
            type: 'traffic_spike',
            title: 'Traffic Spike Detected',
            message: `Traffic increased by ${changePercent.toFixed(1)}% compared to last week`,
            severity: 'info',
            data: {
              today_traffic: todayTraffic,
              last_week_traffic: lastWeekTraffic,
              change_percent: changePercent
            }
          });
        }

        // Traffic drop alert
        if (changePercent < -this.alertRules.traffic_drop.threshold) {
          alerts.push({
            type: 'traffic_drop',
            title: 'Traffic Drop Detected',
            message: `Traffic decreased by ${Math.abs(changePercent).toFixed(1)}% compared to last week`,
            severity: 'warning',
            data: {
              today_traffic: todayTraffic,
              last_week_traffic: lastWeekTraffic,
              change_percent: changePercent
            }
          });
        }
      }

      return alerts;

    } catch (error) {
      logger.error('Error checking traffic alerts:', error);
      return [];
    }
  }

  async checkConversionAlerts() {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get recent conversions
      const recentConversions = await Analytics.count({
        where: {
          conversion: true,
          created_at: {
            [Op.gte]: yesterday
          }
        }
      });

      // Get last week conversions
      const lastWeekConversions = await Analytics.count({
        where: {
          conversion: true,
          created_at: {
            [Op.between]: [
              new Date(lastWeek.getTime() - 24 * 60 * 60 * 1000),
              lastWeek
            ]
          }
        }
      });

      const alerts = [];

      if (lastWeekConversions > 0) {
        const conversionChangePercent = ((recentConversions - lastWeekConversions) / lastWeekConversions) * 100;

        if (conversionChangePercent < -this.alertRules.conversion_drop.threshold) {
          alerts.push({
            type: 'conversion_drop',
            title: 'Conversion Rate Drop',
            message: `Conversions dropped by ${Math.abs(conversionChangePercent).toFixed(1)}% compared to last week`,
            severity: 'critical',
            data: {
              today_conversions: recentConversions,
              last_week_conversions: lastWeekConversions,
              change_percent: conversionChangePercent
            }
          });
        }
      }

      return alerts;

    } catch (error) {
      logger.error('Error checking conversion alerts:', error);
      return [];
    }
  }

  async checkBounceRateAlerts() {
    try {
      const bounceRate = await Analytics.getBounceRate(1); // Last 24 hours

      const alerts = [];

      if (bounceRate > this.alertRules.high_bounce_rate.threshold) {
        alerts.push({
          type: 'high_bounce_rate',
          title: 'High Bounce Rate Alert',
          message: `Bounce rate is ${bounceRate.toFixed(1)}%, which is above the threshold of ${this.alertRules.high_bounce_rate.threshold}%`,
          severity: 'warning',
          data: {
            bounce_rate: bounceRate,
            threshold: this.alertRules.high_bounce_rate.threshold
          }
        });
      }

      return alerts;

    } catch (error) {
      logger.error('Error checking bounce rate alerts:', error);
      return [];
    }
  }

  async runAllAlerts() {
    try {
      const [
        trafficAlerts,
        conversionAlerts, 
        bounceRateAlerts
      ] = await Promise.all([
        this.checkTrafficAlerts(),
        this.checkConversionAlerts(),
        this.checkBounceRateAlerts()
      ]);

      const allAlerts = [
        ...trafficAlerts,
        ...conversionAlerts,
        ...bounceRateAlerts
      ];

      if (allAlerts.length > 0) {
        logger.info(`Analytics alerts triggered: ${allAlerts.length} alerts`);
        
        // Here you could integrate with email notifications, Slack, etc.
        for (const alert of allAlerts) {
          logger.warn(`ALERT [${alert.severity.toUpperCase()}]: ${alert.title} - ${alert.message}`);
        }
      }

      return allAlerts;

    } catch (error) {
      logger.error('Error running analytics alerts:', error);
      return [];
    }
  }

  // Schedule alerts to run every hour
  startAlertScheduler() {
    // Run initial check
    this.runAllAlerts();

    // Schedule to run every hour
    setInterval(() => {
      this.runAllAlerts();
    }, 60 * 60 * 1000); // 1 hour

    logger.info('Analytics alerts scheduler started');
  }

  async getGoogleAdsIntegrationGuide() {
    return {
      step1: {
        title: 'Set up Conversion Actions in Google Ads',
        instructions: [
          'Go to Google Ads > Tools & Settings > Conversions',
          'Click "+" to create new conversion action',
          'Choose "Website" as the source',
          'Configure each conversion action from the list below'
        ],
        conversion_actions: this.conversionActions
      },
      step2: {
        title: 'Enable Enhanced Conversions',
        instructions: [
          'In Google Ads, go to Conversions > Enhanced Conversions',
          'Turn on Enhanced Conversions for web',
          'Select "Google tag" as the setup method',
          'Your site is already configured for enhanced conversions'
        ]
      },
      step3: {
        title: 'Set up Smart Bidding',
        instructions: [
          'Go to your Google Ads campaigns',
          'Change bid strategy to "Target CPA" or "Target ROAS"',
          'Set target based on your conversion values',
          'Let Google optimize for conversions automatically'
        ]
      },
      step4: {
        title: 'Create Remarketing Audiences',
        instructions: [
          'Go to Google Ads > Audience Manager',
          'Create audiences based on your analytics data',
          'Use audiences from /api/analytics/audiences endpoint',
          'Set up remarketing campaigns'
        ]
      }
    };
  }
}

// Stub service to prevent startup errors
class AnalyticsAlertsStub {
  startAlertScheduler() {
    console.log('Analytics alerts service temporarily disabled');
  }
  
  stopAlertScheduler() {
    console.log('Analytics alerts service stopped');
  }
}

module.exports = new AnalyticsAlertsStub();
