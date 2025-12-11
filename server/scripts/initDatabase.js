const { sequelize } = require('../config/database');
const { initializeModels } = require('../models');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    console.log('Initializing models...');
    await initializeModels();
    
    console.log('Syncing database schema...');
    await sequelize.sync({ force: false }); // Don't drop existing tables
    console.log('Database schema synced successfully.');

    // Create default admin user if it doesn't exist
    const adminEmail = 'admin@clickbit.com.au';
    
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        status: 'active',
        email_verified: true
      });
      console.log('Default admin user created:');
      console.log('Email: admin@clickbit.com.au');
      console.log('Password: Admin123!');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('\nDatabase initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
};

initDatabase();