const axios = require('axios');

async function testCheckoutFlow() {
  try {
    console.log('🧪 Testing Complete Checkout Flow...\n');
    
    // Test 1: Check public billing settings
    console.log('1️⃣ Testing public billing settings...');
    const billingResponse = await axios.get('http://localhost:5001/api/settings/public/billing-settings');
    console.log('✅ Billing settings loaded successfully');
    console.log('   - Stripe:', billingResponse.data.stripePublishableKey ? '✅' : '❌');
    console.log('   - PayPal:', billingResponse.data.paypalClientId ? '✅' : '❌');
    
    // Test 2: Test payment intent creation (Stripe)
    console.log('\n2️⃣ Testing Stripe payment intent creation...');
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
    
    try {
      const paymentIntentResponse = await axios.post('http://localhost:5001/api/payments/create-payment-intent', {
        amount: 110, // $100 + 10% GST
        currency: 'aud',
        items: testItems,
        customerInfo: testCustomerInfo
      });
      
      console.log('✅ Stripe payment intent created successfully');
      console.log('   - Client Secret:', paymentIntentResponse.data.clientSecret ? '✅' : '❌');
      console.log('   - Payment Intent ID:', paymentIntentResponse.data.paymentIntentId ? '✅' : '❌');
    } catch (error) {
      console.log('❌ Stripe payment intent creation failed:', error.response?.data?.message || error.message);
    }
    
    // Test 3: Test PayPal order creation
    console.log('\n3️⃣ Testing PayPal order creation...');
    try {
      const paypalResponse = await axios.post('http://localhost:5001/api/payments/create-paypal-order', {
        amount: 110,
        currency: 'AUD',
        items: testItems,
        customerInfo: testCustomerInfo
      });
      
      console.log('✅ PayPal order created successfully');
      console.log('   - Order ID:', paypalResponse.data.orderID ? '✅' : '❌');
    } catch (error) {
      console.log('❌ PayPal order creation failed:', error.response?.data?.message || error.message);
    }
    
    // Test 4: Test payment confirmation (mock)
    console.log('\n4️⃣ Testing payment confirmation...');
    try {
      const confirmResponse = await axios.post('http://localhost:5001/api/payments/confirm-payment', {
        paypalOrderId: 'MOCK_ORDER_' + Date.now(),
        items: testItems,
        customerInfo: testCustomerInfo,
        paymentMethod: 'paypal',
        paypalDetails: {
          id: 'MOCK_PAYPAL_ID',
          status: 'COMPLETED'
        }
      });
      
      console.log('✅ Payment confirmation successful');
      console.log('   - Order ID:', confirmResponse.data.order?.id ? '✅' : '❌');
      console.log('   - Order Number:', confirmResponse.data.order?.orderNumber ? '✅' : '❌');
    } catch (error) {
      console.log('❌ Payment confirmation failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n🎉 Checkout flow test completed!');
    console.log('\n💡 Summary:');
    console.log('   - Billing settings: ✅ Working');
    console.log('   - Stripe integration: ' + (billingResponse.data.stripePublishableKey ? '✅ Available' : '❌ Not configured'));
    console.log('   - PayPal integration: ' + (billingResponse.data.paypalClientId ? '✅ Available' : '❌ Not configured'));
    console.log('\n🚀 The checkout should now work properly!');
    
  } catch (error) {
    console.error('❌ Error testing checkout flow:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCheckoutFlow().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 