const express = require('express');
const router = express.Router();
const { Analytics } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const bigQueryService = require('../services/bigQueryService');
const audienceService = require('../services/audienceService');
const googleAdsService = require('../services/googleAdsService');
const analyticsAlerts = require('../services/analyticsAlerts');

// @desc    Track custom event
// @route   POST /api/analytics/track
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const {
      event_type,
      event_name,
      user_id,
      session_id,
      page_url,
      page_title,
      referrer_url,
      ip_address,
      user_agent,
      device_type,
      browser,
      browser_version,
      operating_system,
      os_version,
      country,
      region,
      city,
      latitude,
      longitude,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      event_data,
      value,
      currency,
      duration,
      scroll_depth,
      time_on_page,
      exit_page,
      bounce,
      conversion,
      conversion_value
    } = req.body;

    // Get IP from request if not provided
    const clientIP = ip_address || req.ip || req.connection.remoteAddress;

    const analytics = await Analytics.trackEvent({
      event_type: event_type || 'custom',
      event_name,
      user_id,
      session_id,
      page_url,
      page_title,
      referrer_url,
      ip_address: clientIP,
      user_agent: user_agent || req.get('User-Agent'),
      device_type,
      browser,
      browser_version,
      operating_system,
      os_version,
      country,
      region,
      city,
      latitude,
      longitude,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      event_data,
      value,
      currency,
      duration,
      scroll_depth,
      time_on_page,
      exit_page,
      bounce,
      conversion,
      conversion_value
    });

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      analytics_id: analytics.id
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event',
      error: error.message
    });
  }
});

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { period = 30 } = req.query;
    
    const [
      pageViews,
      topPages,
      topReferrers,
      conversionStats,
      utmStats,
      deviceStats,
      geographicStats
    ] = await Promise.all([
      Analytics.getPageViews(null, period),
      Analytics.getTopPages(10, period),
      Analytics.getTopReferrers(10, period),
      Analytics.getConversionStats(period),
      Analytics.getUTMStats(period),
      Analytics.getDeviceStats(period),
      Analytics.getGeographicStats(period)
    ]);

    res.json({
      success: true,
      data: {
        pageViews: pageViews.length,
        topPages,
        topReferrers,
        conversionStats,
        utmStats,
        deviceStats,
        geographicStats
      }
    });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

// @desc    Get events by type
// @route   GET /api/analytics/events/:type
// @access  Private/Admin
router.get('/events/:type', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { type } = req.params;
    const { period = 30 } = req.query;
    
    const events = await Analytics.getEventsByType(type, period);
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// @desc    Get page views
// @route   GET /api/analytics/pageviews
// @access  Private/Admin
router.get('/pageviews', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { page_url, period = 30 } = req.query;
    
    const pageViews = await Analytics.getPageViews(page_url, period);
    
    res.json({
      success: true,
      data: pageViews
    });
  } catch (error) {
    console.error('Error fetching page views:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page views',
      error: error.message
    });
  }
});

// @desc    Get user events
// @route   GET /api/analytics/users/:userId
// @access  Private/Admin
router.get('/users/:userId', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 30 } = req.query;
    
    const userEvents = await Analytics.getUserEvents(userId, period);
    
    res.json({
      success: true,
      data: userEvents
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user events',
      error: error.message
    });
  }
});

// @desc    Get real-time analytics
// @route   GET /api/analytics/realtime
// @access  Private/Admin
router.get('/realtime', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    // Get events from last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const realtimeData = await Analytics.findAll({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: thirtyMinutesAgo
        }
      },
      order: [['created_at', 'DESC']],
      limit: 100
    });
    
    res.json({
      success: true,
      data: realtimeData
    });
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time analytics',
      error: error.message
    });
  }
});

// @desc    Export data to BigQuery
// @route   POST /api/analytics/export/bigquery
// @access  Private/Admin
router.post('/export/bigquery', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { period = 1 } = req.body; // days
    
    const result = await bigQueryService.exportEventsToBigQuery();
    
    res.json({
      success: true,
      message: 'Data exported to BigQuery successfully',
      exported_count: result.exported
    });
  } catch (error) {
    console.error('Error exporting to BigQuery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export to BigQuery',
      error: error.message
    });
  }
});

// @desc    Get BigQuery configuration status
// @route   GET /api/analytics/bigquery/status
// @access  Private/Admin
router.get('/bigquery/status', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const isConfigured = await bigQueryService.isConfigured();
    const dashboardUrl = bigQueryService.getDataStudioDashboardUrl();
    
    res.json({
      success: true,
      data: {
        configured: isConfigured,
        dashboard_url: dashboardUrl,
        setup_instructions: isConfigured ? null : {
          step1: 'Set GOOGLE_CLOUD_PROJECT_ID environment variable',
          step2: 'Set GOOGLE_CLOUD_KEY_FILE environment variable (path to service account JSON)',
          step3: 'Install @google-cloud/bigquery package: npm install @google-cloud/bigquery'
        }
      }
    });
  } catch (error) {
    console.error('Error checking BigQuery status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check BigQuery status',
      error: error.message
    });
  }
});

// @desc    Get audience analytics
// @route   GET /api/analytics/audiences
// @access  Private/Admin
router.get('/audiences', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const audienceStats = await audienceService.getAudienceStats();
    
    res.json({
      success: true,
      data: audienceStats
    });
  } catch (error) {
    console.error('Error fetching audience data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audience data',
      error: error.message
    });
  }
});

// @desc    Get specific audience users
// @route   GET /api/analytics/audiences/:type
// @access  Private/Admin
router.get('/audiences/:type', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 100 } = req.query;
    
    const users = await audienceService.getAudienceUsers(type, limit);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching audience users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audience users',
      error: error.message
    });
  }
});

// @desc    Export audience for Google Ads Customer Match
// @route   POST /api/analytics/audiences/:type/export
// @access  Private/Admin
router.post('/audiences/:type/export', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'email' } = req.body;
    
    const exportData = await audienceService.exportAudienceForGoogleAds(type, format);
    
    res.json({
      success: true,
      data: exportData,
      count: exportData.length,
      instructions: {
        google_ads: 'Go to Google Ads > Audience Manager > Customer Match to upload this list',
        format: format,
        privacy_note: 'Ensure you have proper consent for advertising use'
      }
    });
  } catch (error) {
    console.error('Error exporting audience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export audience',
      error: error.message
    });
  }
});

// @desc    Get conversion optimization recommendations
// @route   GET /api/analytics/recommendations
// @access  Private/Admin
router.get('/recommendations', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const { period = 30 } = req.query;
    
    // Analyze current performance and provide recommendations
    const [
      conversionStats,
      deviceStats,
      topPages,
      bounceRate
    ] = await Promise.all([
      Analytics.getConversionStats(period),
      Analytics.getDeviceStats(period),
      Analytics.getTopPages(5, period),
      Analytics.getBounceRate(period)
    ]);

    const recommendations = [];

    // High bounce rate recommendation
    if (bounceRate > 70) {
      recommendations.push({
        type: 'page_optimization',
        priority: 'high',
        title: 'High Bounce Rate Detected',
        description: `Your bounce rate is ${bounceRate.toFixed(1)}%. Consider improving page load speed and content relevance.`,
        action: 'Optimize top landing pages for better engagement'
      });
    }

    // Mobile optimization
    const mobileTraffic = deviceStats.find(d => d.device_type === 'mobile');
    const totalTraffic = deviceStats.reduce((sum, d) => sum + parseInt(d.visits), 0);
    const mobilePercentage = mobileTraffic ? (parseInt(mobileTraffic.visits) / totalTraffic) * 100 : 0;
    
    if (mobilePercentage > 60) {
      recommendations.push({
        type: 'mobile_optimization',
        priority: 'medium',
        title: 'Mobile-First Optimization Opportunity',
        description: `${mobilePercentage.toFixed(1)}% of your traffic is mobile. Ensure mobile experience is optimized.`,
        action: 'Focus on mobile page speed and user experience'
      });
    }

    // Conversion optimization
    const totalConversions = conversionStats.reduce((sum, stat) => sum + parseInt(stat.conversions), 0);
    if (totalConversions < 10) {
      recommendations.push({
        type: 'conversion_optimization',
        priority: 'high',
        title: 'Low Conversion Rate',
        description: `Only ${totalConversions} conversions in the last ${period} days. Consider optimizing your call-to-action buttons.`,
        action: 'A/B test different CTA designs and placements'
      });
    }

    res.json({
      success: true,
      data: {
        recommendations,
        metrics: {
          bounce_rate: bounceRate,
          mobile_percentage: mobilePercentage,
          total_conversions: totalConversions
        }
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// @desc    Get Google Ads integration guide
// @route   GET /api/analytics/google-ads/guide
// @access  Private/Admin
router.get('/google-ads/guide', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const guide = await googleAdsService.getGoogleAdsIntegrationGuide();
    
    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Error fetching Google Ads guide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Google Ads guide',
      error: error.message
    });
  }
});

// @desc    Get current analytics alerts
// @route   GET /api/analytics/alerts
// @access  Private/Admin
router.get('/alerts', protect, authorize('dashboard:view'), async (req, res) => {
  try {
    const alerts = await analyticsAlerts.runAllAlerts();
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching analytics alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics alerts',
      error: error.message
    });
  }
});

module.exports = router; 