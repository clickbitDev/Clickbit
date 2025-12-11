const { logger } = require('../utils/logger');
const { Analytics } = require('../models');

class GoogleAdsService {
  constructor() {
    this.conversionActions = {
      'form_submit': {
        name: 'Contact Form Submission',
        value: 10,
        action_type: 'lead_generation'
      },
      'purchase': {
        name: 'Purchase Completed',
        value_dynamic: true, // Use actual purchase value
        action_type: 'purchase'
      },
      'quote_request': {
        name: 'Quote Request',
        value: 25,
        action_type: 'lead_generation'
      },
      'phone_click': {
        name: 'Phone Call Click',
        value: 15,
        action_type: 'phone_call_lead'
      },
      'email_click': {
        name: 'Email Click',
        value: 5,
        action_type: 'email_lead'
      }
    };
  }

  // Generate Google Ads conversion tracking code
  generateConversionCode(conversionLabel, conversionValue = null) {
    return `
<!-- Google Ads Conversion Tracking -->
<script>
  gtag('event', 'conversion', {
    'send_to': 'AW-${process.env.GOOGLE_ADS_CONVERSION_ID || 'XXXXXXXXX'}/${conversionLabel}',
    'value': ${conversionValue || 1.0},
    'currency': 'AUD'
  });
</script>`;
  }

  // Get conversion optimization suggestions
  async getConversionOptimizations(period = 30) {
    try {
      const conversionStats = await Analytics.getConversionStats(period);
      const deviceStats = await Analytics.getDeviceStats(period);
      
      const optimizations = [];

      // Analyze conversion performance by device
      const mobileConversions = await Analytics.findAll({
        attributes: [
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'conversions']
        ],
        where: {
          conversion: true,
          device_type: 'mobile',
          created_at: {
            [require('sequelize').Op.gte]: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        }
      });

      const desktopConversions = await Analytics.findAll({
        attributes: [
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'conversions']
        ],
        where: {
          conversion: true,
          device_type: 'desktop',
          created_at: {
            [require('sequelize').Op.gte]: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        }
      });

      optimizations.push({
        type: 'device_bidding',
        title: 'Device Bid Adjustments',
        mobile_conversions: mobileConversions[0]?.getDataValue('conversions') || 0,
        desktop_conversions: desktopConversions[0]?.getDataValue('conversions') || 0,
        recommendation: 'Adjust bids based on device performance'
      });

      // Analyze time-based patterns
      const hourlyConversions = await Analytics.findAll({
        attributes: [
          [require('sequelize').fn('HOUR', require('sequelize').col('created_at')), 'hour'],
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'conversions']
        ],
        where: {
          conversion: true,
          created_at: {
            [require('sequelize').Op.gte]: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        },
        group: [require('sequelize').fn('HOUR', require('sequelize').col('created_at'))],
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
      });

      optimizations.push({
        type: 'time_based_bidding',
        title: 'Time-based Bid Adjustments',
        best_hours: hourlyConversions.slice(0, 3),
        recommendation: 'Increase bids during peak conversion hours'
      });

      return optimizations;

    } catch (error) {
      logger.error('Error getting conversion optimizations:', error);
      throw error;
    }
  }

  // Generate Google Ads script for enhanced tracking
  generateEnhancedTrackingScript() {
    return `
<!-- Enhanced Google Ads Tracking -->
<script>
  // Enhanced conversion tracking with dynamic values
  function trackGoogleAdsConversion(conversionLabel, value, currency = 'AUD') {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': 'AW-${process.env.GOOGLE_ADS_CONVERSION_ID || 'XXXXXXXXX'}/' + conversionLabel,
        'value': value,
        'currency': currency,
        'transaction_id': Date.now().toString()
      });
    }
  }

  // Track form conversions
  function trackFormConversion(formType, value = 10) {
    trackGoogleAdsConversion('${this.conversionActions.form_submit.name}', value);
  }

  // Track purchase conversions
  function trackPurchaseConversion(orderValue, orderId) {
    trackGoogleAdsConversion('${this.conversionActions.purchase.name}', orderValue);
    
    // Enhanced ecommerce for Google Ads
    gtag('event', 'purchase', {
      'transaction_id': orderId,
      'value': orderValue,
      'currency': 'AUD',
      'send_to': 'AW-${process.env.GOOGLE_ADS_CONVERSION_ID || 'XXXXXXXXX'}'
    });
  }

  // Make functions globally available
  window.trackGoogleAdsConversion = trackGoogleAdsConversion;
  window.trackFormConversion = trackFormConversion;
  window.trackPurchaseConversion = trackPurchaseConversion;
</script>`;
  }

  // Get audience targeting recommendations
  async getAudienceTargetingRecommendations() {
    try {
      const audienceService = require('./audienceService');
      const audiences = await audienceService.getAudienceStats();
      
      const recommendations = [];

      Object.entries(audiences).forEach(([type, data]) => {
        if (data.count > 100) { // Minimum for Google Ads custom audiences
          recommendations.push({
            audience_type: type,
            name: data.name,
            size: data.count,
            google_ads_setup: {
              step1: 'Go to Google Ads > Audience Manager',
              step2: 'Click "+" and select "Custom Audience"',
              step3: `Upload audience list for "${data.name}"`,
              step4: 'Use for remarketing campaigns'
            }
          });
        }
      });

      return recommendations;

    } catch (error) {
      logger.error('Error getting audience targeting recommendations:', error);
      throw error;
    }
  }
}

module.exports = new GoogleAdsService();
