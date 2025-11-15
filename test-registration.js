const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');

const BASE_URL = process.env.FRONTEND_URL?.replace('#', '') || 'http://localhost:5001';
const API_URL = `${BASE_URL}/api/auth`;

async function testRegistration() {
  console.log('\n=== Testing Registration Flow ===\n');
  
  // Test 1: Register with existing email (should return 409)
  console.log('Test 1: Register with existing email...');
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email: 'testuser@example.com',
      password: 'Test123!@#',
      first_name: 'Test',
      last_name: 'User',
      phone: '1234567890'
    });
    console.log('❌ FAILED: Should have returned error');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response?.status === 409 && error.response?.data?.error === 'EMAIL_EXISTS') {
      console.log('✅ PASSED: Correctly returned 409 with EMAIL_EXISTS error');
      console.log('Message:', error.response.data.message);
    } else {
      console.log('❌ FAILED: Wrong error response');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
    }
  }
  
  // Test 2: Register with new email (should succeed)
  console.log('\nTest 2: Register with new email...');
  const uniqueEmail = `test${Date.now()}@test.com`;
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email: uniqueEmail,
      password: 'Test123!@#',
      first_name: 'New',
      last_name: 'User',
      phone: '1234567890'
    });
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ PASSED: Registration successful');
      console.log('Message:', response.data.message);
      console.log('Email:', response.data.data?.email);
      console.log('Requires Verification:', response.data.data?.requiresVerification);
      
      // Store token for verification test
      if (response.data.data?.verificationToken) {
        global.testToken = response.data.data.verificationToken;
      }
      global.testEmail = uniqueEmail;
    } else {
      console.log('❌ FAILED: Unexpected response');
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.log('❌ FAILED: Registration error');
    console.log('Error:', error.response?.data || error.message);
  }
  
  // Test 3: Try to register again with same email (should fail)
  if (global.testEmail) {
    console.log('\nTest 3: Try to register again with same email...');
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: global.testEmail,
        password: 'Test123!@#',
        first_name: 'Duplicate',
        last_name: 'User'
      });
      console.log('❌ FAILED: Should have returned error');
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response?.status === 409 && error.response?.data?.error === 'EMAIL_EXISTS') {
        console.log('✅ PASSED: Correctly prevented duplicate registration');
        console.log('Message:', error.response.data.message);
      } else {
        console.log('❌ FAILED: Wrong error response');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
      }
    }
  }
  
  console.log('\n=== Test Summary ===');
  console.log('All registration flow tests completed!\n');
  process.exit(0);
}

testRegistration().catch(error => {
  console.error('Test error:', error.message);
  process.exit(1);
});

