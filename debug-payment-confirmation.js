const axios = require('axios');

async function debugPaymentConfirmation() {
  try {
    console.log('🔍 Debugging Payment Confirmation...\n');
    
    const testItems = [
      { id: '1', name: 'Test Service', price: 100, quantity: 1 }
    ];
    const testCustomerInfo = {
      email: 'test@example.com',
      name: 'Test Customer',
      address: '123 Test St',
      city: 'Sydney',
      postcode: '2000',
      state: 'NSW',
      country: 'Australia'
    };
    
    console.log('📋 Test Data:');
    console.log('Items:', JSON.stringify(testItems, null, 2));
    console.log('Customer Info:', JSON.stringify(testCustomerInfo, null, 2));
    
    try {
      const response = await axios.post('http://localhost:5001/api/payments/confirm-payment', {
        paypalOrderId: 'MOCK_ORDER_' + Date.now(),
        items: testItems,
        customerInfo: testCustomerInfo,
        paymentMethod: 'paypal',
        paypalDetails: {
          id: 'MOCK_PAYPAL_ID',
          status: 'COMPLETED'
        }
      });
      
      console.log('✅ Payment confirmation successful!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Payment confirmation failed');
      console.log('Error message:', error.message);
      console.log('Response status:', error.response?.status);
      console.log('Response data:', error.response?.data);
      
      if (error.response?.data?.message) {
        console.log('Server error message:', error.response.data.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug script error:', error);
  }
}

debugPaymentConfirmation().then(() => {
  console.log('\n✅ Debug completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
}); 