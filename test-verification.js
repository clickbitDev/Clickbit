const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const jwt = require('jsonwebtoken');
const { User } = require('./server/models');

async function testVerification() {
  console.log('\n=== Testing Email Verification Flow ===\n');
  
  try {
    // Find a user with unverified email
    const user = await User.findOne({
      where: {
        email_verified: false,
        email_verification_token: { [require('sequelize').Op.ne]: null }
      }
    });
    
    if (!user) {
      console.log('⚠️  No unverified users found. Creating test user...');
      // Create a test token
      const testEmail = `verifytest${Date.now()}@test.com`;
      const token = jwt.sign(
        { email: testEmail, type: 'email_verification' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const newUser = await User.create({
        email: testEmail,
        password: 'Test123!@#',
        first_name: 'Verify',
        last_name: 'Test',
        email_verification_token: token,
        email_verified: false,
        status: 'active'
      });
      
      console.log('✅ Test user created:', newUser.email);
      console.log('Token:', token.substring(0, 50) + '...');
      
      // Test verification
      console.log('\nTest: Verify email with token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type === 'email_verification' && decoded.email === testEmail) {
        console.log('✅ Token validation passed');
        
        // Update user
        await newUser.update({
          email_verified: true,
          email_verification_token: null,
          status: 'active'
        });
        
        console.log('✅ Database update successful');
        console.log('Email Verified:', newUser.email_verified);
        console.log('Status:', newUser.status);
        console.log('Token Cleared:', !newUser.email_verification_token);
      }
    } else {
      console.log('Found unverified user:', user.email);
      console.log('Has Token:', !!user.email_verification_token);
      console.log('Email Verified:', user.email_verified);
      console.log('Status:', user.status);
      
      if (user.email_verification_token) {
        // Test token validation
        try {
          const decoded = jwt.verify(user.email_verification_token, process.env.JWT_SECRET);
          console.log('\n✅ Token is valid');
          console.log('Token Type:', decoded.type);
          console.log('Token Email:', decoded.email);
          
          if (decoded.type === 'email_verification') {
            console.log('\nTest: Simulating verification...');
            await user.update({
              email_verified: true,
              email_verification_token: null,
              status: 'active'
            });
            
            // Reload user
            await user.reload();
            console.log('✅ Verification successful');
            console.log('Email Verified:', user.email_verified);
            console.log('Status:', user.status);
            console.log('Token Cleared:', !user.email_verification_token);
          }
        } catch (tokenError) {
          console.log('❌ Token validation failed:', tokenError.message);
        }
      }
    }
    
    console.log('\n=== Verification Test Complete ===\n');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testVerification();

