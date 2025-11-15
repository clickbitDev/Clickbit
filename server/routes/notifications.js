const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { Notification } = require('../models');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

// @desc    Webhook endpoint for Uptime Kuma notifications
// @route   POST /api/notifications/webhook/uptime-kuma
// @access  Public (webhook endpoint)
router.post('/webhook/uptime-kuma', async (req, res) => {
  try {
    // Log the incoming webhook payload for debugging
    logger.info('Uptime Kuma webhook received', {
      body: req.body,
      headers: req.headers
    });

    // Extract data from Uptime Kuma webhook payload
    // Uptime Kuma typically sends: msg, monitorName, monitorUrl, status, time
    const {
      msg,
      monitorName,
      monitorUrl,
      status,
      time,
      heartbeat,
      ...otherData
    } = req.body;

    // Determine notification type based on status
    let notificationType = 'info';
    let title = 'Monitor Status Update';
    
    if (status === 'down' || status === 'DOWN') {
      notificationType = 'error';
      title = `Monitor Down: ${monitorName || 'Unknown Monitor'}`;
    } else if (status === 'up' || status === 'UP') {
      notificationType = 'success';
      title = `Monitor Up: ${monitorName || 'Unknown Monitor'}`;
    } else if (status === 'paused' || status === 'PAUSED') {
      notificationType = 'warning';
      title = `Monitor Paused: ${monitorName || 'Unknown Monitor'}`;
    }

    // Create notification message
    const message = msg || `${monitorName || 'Monitor'} is ${status || 'unknown'}`;
    
    // Create notification in database
    const notification = await Notification.create({
      title: title,
      message: message,
      type: notificationType,
      source: 'uptime-kuma',
      monitor_name: monitorName || null,
      monitor_url: monitorUrl || null,
      status: status || null,
      metadata: {
        ...otherData,
        heartbeat,
        received_at: new Date().toISOString(),
        original_payload: req.body
      },
      is_read: false
    });

    logger.info('Notification created from Uptime Kuma webhook', {
      notificationId: notification.id,
      monitorName,
      status
    });

    // Emit Socket.IO event if available (for real-time updates)
    try {
      const app = req.app;
      const socketService = app.get('socketService');
      if (socketService) {
        socketService.emitToAdmins('notification:new', {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          time: notification.created_at
        });
      }
    } catch (socketError) {
      logger.warn('Failed to emit socket event for notification', socketError);
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Notification received and stored',
      notificationId: notification.id
    });
  } catch (error) {
    logger.error('Error processing Uptime Kuma webhook', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('dashboard:view'),
  async (req, res) => {
    try {
      const { limit = 50, offset = 0, unread_only = false } = req.query;

      const where = {};
      if (unread_only === 'true') {
        where.is_read = false;
      }

      const notifications = await Notification.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format notifications for frontend
      const formattedNotifications = notifications.rows.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time: formatTimeAgo(notification.created_at),
        type: notification.type,
        is_read: notification.is_read,
        source: notification.source,
        monitor_name: notification.monitor_name,
        monitor_url: notification.monitor_url
      }));

      res.status(200).json({
        success: true,
        notifications: formattedNotifications,
        total: notifications.count,
        unread_count: await Notification.count({ where: { is_read: false } })
      });
    } catch (error) {
      logger.error('Error fetching notifications', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
router.put(
  '/:id/read',
  protect,
  authorize('dashboard:view'),
  async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      await notification.markAsRead();

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification
      });
    } catch (error) {
      logger.error('Error marking notification as read', error);
      res.status(500).json({
        success: false,
        message: 'Error marking notification as read',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
router.put(
  '/read-all',
  protect,
  authorize('dashboard:view'),
  async (req, res) => {
    try {
      await Notification.update(
        { is_read: true, read_at: new Date() },
        { where: { is_read: false } }
      );

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      logger.error('Error marking all notifications as read', error);
      res.status(500).json({
        success: false,
        message: 'Error marking all notifications as read',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

module.exports = router;

