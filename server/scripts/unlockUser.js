const { sequelize } = require('../config/database');
const User = require('../models/User');

const unlockUser = async () => {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Please provide an email address as argument');
      process.exit(1);
    }
    
    await sequelize.authenticate();
    console.log('Database connected');
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    user.login_attempts = 0;
    user.locked_until = null;
    await user.save();
    
    console.log(`User ${email} has been unlocked successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error unlocking user:', error);
    process.exit(1);
  }
};

unlockUser(); 