const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { sequelize } = require('../config/database');
const { initializeModels } = require('../models');
const Notification = require('../models/Notification');

const syncNotificationsTable = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.\n');

    console.log('📊 Initializing models...');
    await initializeModels();
    console.log('✅ Models initialized.\n');

    console.log('🔄 Syncing notifications table...');
    await Notification.sync({ alter: true }); // This will create the table if it doesn't exist
    console.log('✅ Notifications table synced successfully.\n');

    // Verify the table exists
    const [results] = await sequelize.query("SHOW TABLES LIKE 'notifications'");
    if (results.length > 0) {
      console.log('✅ Notifications table exists in database.\n');
      
      // Check table structure
      const [columns] = await sequelize.query("DESCRIBE notifications");
      console.log('📋 Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });
    } else {
      console.log('⚠️  Notifications table not found after sync.');
    }

    console.log('\n✅ Database sync complete!');
  } catch (error) {
    console.error('❌ Error syncing notifications table:', error);
    if (error.original) {
      console.error('   Original error:', error.original.message);
    }
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

syncNotificationsTable();

