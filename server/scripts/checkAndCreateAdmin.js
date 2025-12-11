const { sequelize } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const checkAndCreateAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Check existing users
    const users = await User.findAll();
    console.log('Existing users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
    
    // Create admin user if doesn't exist
    const adminEmail = 'admin@clickbit.com.au';
    let admin = await User.findOne({ where: { email: adminEmail } });
    
    if (!admin) {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      admin = await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user exists, updating password...');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log('Admin password updated');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndCreateAdmin();