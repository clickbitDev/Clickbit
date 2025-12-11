const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { SiteSetting } = require('../models');

// @desc    Get public billing settings (for checkout)
// @route   GET /api/settings/public/billing-settings
// @access  Public
router.get('/public/billing-settings', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      where: {
        setting_key: 'billing_settings'
      }
    });

    if (!setting) {
      // Return default public values
      const defaultSettings = {
        stripePublishableKey: '',
        paypalClientId: '',
        currencyCode: 'AUD',
        taxRate: 10
      };

      res.json(defaultSettings);
    } else {
      const billingData = JSON.parse(setting.setting_value);
      
      // Only return public settings (no secret keys)
      const publicSettings = {
        stripePublishableKey: billingData.stripePublishableKey || '',
        paypalClientId: billingData.paypalClientId || '',
        currencyCode: billingData.currencyCode || 'AUD',
        taxRate: billingData.taxRate || 10
      };
      
      res.json(publicSettings);
    }
  } catch (error) {
    console.error('Error fetching public billing settings:', error);
    res.status(500).json({ error: 'Failed to fetch billing settings' });
  }
});

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const settings = await SiteSetting.findAll({
      where: {
        is_public: true,
        auto_load: true
      },
      attributes: ['setting_key', 'setting_value', 'setting_type']
    });

    // Transform to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Error fetching public settings', error: error.message });
  }
});

// @desc    Get specific public setting
// @route   GET /api/settings/public/:key
// @access  Public
router.get('/public/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      where: {
        setting_key: req.params.key,
        is_public: true
      },
      attributes: ['setting_key', 'setting_value', 'setting_type']
    });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found or not public' });
    }

    res.json({
      [setting.setting_key]: setting.setting_value
    });
  } catch (error) {
    console.error('Error fetching public setting:', error);
    res.status(500).json({ message: 'Error fetching public setting', error: error.message });
  }
});

// ADMIN ROUTES

// @desc    Get all settings for admin
// @route   GET /api/settings/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('settings:view'), async (req, res) => {
  try {
    const { type, search } = req.query;
    
    const whereClause = {};

    // Filter by setting type
    if (type && type !== 'all') {
      whereClause.setting_type = type;
    }

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { setting_key: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const settings = await SiteSetting.findAll({
      where: whereClause,
      order: [['setting_type', 'ASC'], ['setting_key', 'ASC']]
    });

    res.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// @desc    Get settings by type
// @route   GET /api/settings/admin/type/:type
// @access  Private/Admin
router.get('/admin/type/:type', protect, authorize('settings:view'), async (req, res) => {
  try {
    const settings = await SiteSetting.findAll({
      where: {
        setting_type: req.params.type
      },
      order: [['setting_key', 'ASC']]
    });

    // Transform to key-value object for easier frontend consumption
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = {
        value: setting.setting_value,
        description: setting.description,
        is_public: setting.is_public,
        auto_load: setting.auto_load
      };
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings by type:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// @desc    Get single setting
// @route   GET /api/settings/admin/:key
// @access  Private/Admin
router.get('/admin/:key', protect, authorize('settings:view'), async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      where: {
        setting_key: req.params.key
      }
    });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ message: 'Error fetching setting', error: error.message });
  }
});

// @desc    Create or update setting
// @route   PUT /api/settings/admin/:key
// @access  Private/Admin
router.put('/admin/:key', protect, authorize('settings:update'), async (req, res) => {
  try {
    const { setting_value, setting_type, description, is_public, auto_load } = req.body;
    
    const [setting, created] = await SiteSetting.findOrCreate({
      where: { setting_key: req.params.key },
      defaults: {
        setting_key: req.params.key,
        setting_value,
        setting_type: setting_type || 'system',
        description,
        is_public: is_public || false,
        auto_load: auto_load || false
      }
    });

    if (!created) {
      await setting.update({
        setting_value,
        setting_type: setting_type || setting.setting_type,
        description: description || setting.description,
        is_public: is_public !== undefined ? is_public : setting.is_public,
        auto_load: auto_load !== undefined ? auto_load : setting.auto_load
      });
    }

    res.json({
      message: created ? 'Setting created successfully' : 'Setting updated successfully',
      setting
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
});

// @desc    Update multiple settings
// @route   PUT /api/settings/admin/bulk
// @access  Private/Admin
router.put('/admin/bulk', protect, authorize('settings:update'), async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object is required' });
    }

    const results = [];

    for (const [key, data] of Object.entries(settings)) {
      const [setting, created] = await SiteSetting.findOrCreate({
        where: { setting_key: key },
        defaults: {
          setting_key: key,
          setting_value: data.value || data,
          setting_type: data.setting_type || 'system',
          description: data.description,
          is_public: data.is_public || false,
          auto_load: data.auto_load || false
        }
      });

      if (!created) {
        await setting.update({
          setting_value: data.value || data,
          setting_type: data.setting_type || setting.setting_type,
          description: data.description || setting.description,
          is_public: data.is_public !== undefined ? data.is_public : setting.is_public,
          auto_load: data.auto_load !== undefined ? data.auto_load : setting.auto_load
        });
      }

      results.push({
        key,
        created,
        setting
      });
    }

    res.json({
      message: 'Settings updated successfully',
      results
    });
  } catch (error) {
    console.error('Error updating bulk settings:', error);
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// @desc    Delete setting
// @route   DELETE /api/settings/admin/:key
// @access  Private/Admin
router.delete('/admin/:key', protect, authorize('settings:delete'), async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      where: {
        setting_key: req.params.key
      }
    });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    await setting.destroy();

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ message: 'Error deleting setting', error: error.message });
  }
});

// LEGACY COMPATIBILITY ROUTES (for backward compatibility)

// @desc    Get marketing integrations (legacy)
// @route   GET /api/settings/marketing-integrations
// @access  Private/Admin
router.get('/marketing-integrations', protect, async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      where: {
        setting_key: 'marketing_integrations'
      }
    });

    if (!setting) {
      // Return default values
      const defaultIntegrations = {
        headerScripts: '',
        googleSearchConsoleTag: '',
        googleAnalyticsId: '',
        facebookPixelId: '',
        customMetaTags: ''
      };

      res.json(defaultIntegrations);
    } else {
      res.json(setting.setting_value);
    }
  } catch (error) {
    console.error('Error fetching marketing integrations:', error);
    res.status(500).json({ error: 'Failed to fetch marketing integrations' });
  }
});

// @desc    Update marketing integrations (legacy)
// @route   PUT /api/settings/marketing-integrations
// @access  Private/Admin
router.put('/marketing-integrations', protect, async (req, res) => {
  try {
    const { marketingIntegrations } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'marketing_integrations' },
      defaults: {
        setting_key: 'marketing_integrations',
        setting_value: marketingIntegrations,
        setting_type: 'marketing',
        description: 'Marketing and analytics integration settings',
        is_public: false,
        auto_load: false
      }
    });

    await setting.update({
      setting_value: marketingIntegrations
    });

    res.json({ message: 'Marketing integrations updated successfully' });
  } catch (error) {
    console.error('Error updating marketing integrations:', error);
    res.status(500).json({ error: 'Failed to update marketing integrations' });
  }
});

// @desc    Get billing settings (legacy)
// @route   GET /api/settings/billing-settings
// @access  Private/Admin
router.get('/billing-settings', protect, async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      where: {
        setting_key: 'billing_settings'
      }
    });

    if (!setting) {
      // Return default values
      const defaultSettings = {
        stripePublishableKey: '',
        stripeSecretKey: '',
        paypalClientId: '',
        paypalClientSecret: '',
        currencyCode: 'AUD',
        taxRate: 10,
        companyAbn: '',
        billingAddress: '',
        paymentTerms: 'Net 30'
      };

      res.json(defaultSettings);
    } else {
      const billingData = JSON.parse(setting.setting_value);
      res.json(billingData);
    }
  } catch (error) {
    console.error('Error fetching billing settings:', error);
    res.status(500).json({ error: 'Failed to fetch billing settings' });
  }
});

// @desc    Update billing settings (legacy)
// @route   PUT /api/settings/billing-settings
// @access  Private/Admin
router.put('/billing-settings', protect, async (req, res) => {
  try {
    const { billingSettings } = req.body;

    const [setting] = await SiteSetting.findOrCreate({
      where: { setting_key: 'billing_settings' },
      defaults: {
        setting_key: 'billing_settings',
        setting_value: billingSettings,
        setting_type: 'billing',
        description: 'Payment and billing configuration settings',
        is_public: false,
        auto_load: false
      }
    });

    await setting.update({
      setting_value: billingSettings
    });

    res.json({ message: 'Billing settings updated successfully' });
  } catch (error) {
    console.error('Error updating billing settings:', error);
    res.status(500).json({ error: 'Failed to update billing settings' });
  }
});

module.exports = router;