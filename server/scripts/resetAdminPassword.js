const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { User, initializeModels } = require('../models');
const { connectDatabase, sequelize } = require('../config/database');

const resetAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    await initializeModels();
    console.log('Database connected and models initialized.');

    const adminEmail = 'admin@clickbit.com.au';
    const adminPassword = 'Admin123!';

    // Find or create the admin user
    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        first_name: 'Admin',
        last_name: 'User',
        password: adminPassword,
        role: 'admin',
        status: 'active',
        email_verified: true,
      }
    });

    if (created) {
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      // If user existed, update their password and ensure they are an admin
      user.password = adminPassword;
      user.role = 'admin';
      user.status = 'active';
      user.login_attempts = 0;
      user.locked_until = null;
      await user.save();
      console.log(`Admin password has been reset for: ${adminEmail}`);
    }

  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

resetAdmin(); 