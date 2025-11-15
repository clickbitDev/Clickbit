const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { sequelize } = require('../config/database');
const Notification = require('../models/Notification');

const checkNotifications = async () => {
  try {
    await sequelize.authenticate();
    
    const notifications = await Notification.findAll({
      order: [['created_at', 'DESC']],
      limit: 10
    });

    console.log(`\n📬 Found ${notifications.length} notification(s) in database:\n`);
    
    notifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.type.toUpperCase()}] ${notif.title}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Source: ${notif.source || 'N/A'}`);
      console.log(`   Monitor: ${notif.monitor_name || 'N/A'}`);
      console.log(`   Status: ${notif.status || 'N/A'}`);
      console.log(`   Read: ${notif.is_read ? 'Yes' : 'No'}`);
      console.log(`   Created: ${notif.created_at}`);
      console.log('');
    });

    const unreadCount = await Notification.count({ where: { is_read: false } });
    console.log(`📊 Unread notifications: ${unreadCount}\n`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

checkNotifications();

