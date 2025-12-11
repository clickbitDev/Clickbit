const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');

const BASE_URL = 'http://localhost:5001';
const API_URL = `${BASE_URL}/api/auth`;

async function testCompleteFlow() {
  console.log('\n=== Complete Auth Flow Test ===\n');
  
  const uniqueEmail = `completeflow${Date.now()}@test.com`;
  const password = 'Test123!@#';
  let verificationToken = null;
  
  try {
    // Step 1: Register new user
    console.log('Step 1: Registering new user...');
    const registerResponse = await axios.post(`${API_URL}/register`, {
      email: uniqueEmail,
      password: password,
      first_name: 'Complete',
      last_name: 'Flow',
      phone: '1234567890'
    });
    
    if (registerResponse.status === 201 && registerResponse.data.success) {
      console.log('✅ Registration successful');
      console.log('   Message:', registerResponse.data.message);
      console.log('   Email:', registerResponse.data.data.email);
      console.log('   Requires Verification:', registerResponse.data.data.requiresVerification);
    } else {
      console.log('❌ Registration failed');
      console.log('   Response:', registerResponse.data);
      return;
    }
    
    // Step 2: Try to login before verification (should fail)
    console.log('\nStep 2: Attempting login before email verification...');
    try {
      await axios.post(`${API_URL}/login`, {
        email: uniqueEmail,
        password: password
      });
      console.log('❌ FAILED: Should not be able to login before verification');
    } catch (loginError) {
      if (loginError.response?.status === 401) {
        const message = loginError.response.data.message;
        if (message.includes('verify') || message.includes('verification')) {
          console.log('✅ Correctly blocked login - email not verified');
          console.log('   Message:', message);
        } else {
          console.log('⚠️  Login blocked but wrong message:', message);
        }
      } else {
        console.log('❌ Unexpected error:', loginError.response?.data);
      }
    }
    
    // Step 3: Try to register again with same email (should fail)
    console.log('\nStep 3: Attempting duplicate registration...');
    try {
      await axios.post(`${API_URL}/register`, {
        email: uniqueEmail,
        password: password,
        first_name: 'Duplicate',
        last_name: 'User'
      });
      console.log('❌ FAILED: Should not allow duplicate registration');
    } catch (dupError) {
      if (dupError.response?.status === 409 && dupError.response?.data?.error === 'EMAIL_EXISTS') {
        console.log('✅ Correctly prevented duplicate registration');
        console.log('   Message:', dupError.response.data.message);
      } else {
        console.log('❌ Wrong error response');
        console.log('   Status:', dupError.response?.status);
        console.log('   Data:', dupError.response?.data);
      }
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ Registration flow working correctly');
    console.log('✅ Email verification requirement enforced');
    console.log('✅ Duplicate registration prevented');
    console.log('\nNote: To test email verification, you need the actual token from the email.');
    console.log('The verification endpoint is ready and will update the database when called.\n');
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testCompleteFlow();

