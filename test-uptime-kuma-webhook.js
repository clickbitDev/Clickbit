const axios = require('axios');

// Test the Uptime Kuma webhook endpoint
const testWebhook = async () => {
  const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:5001/api/notifications/webhook/uptime-kuma';
  
  // Simulate Uptime Kuma webhook payload
  const testPayloads = [
    {
      name: 'Monitor Down Test',
      payload: {
        msg: 'Monitor is DOWN',
        monitorName: 'ClickBit Website',
        monitorUrl: 'https://clickbit.com.au',
        status: 'down',
        time: new Date().toISOString(),
        heartbeat: {
          status: 'down',
          msg: 'HTTP 500 - Internal Server Error',
          ping: 1234
        }
      }
    },
    {
      name: 'Monitor Up Test',
      payload: {
        msg: 'Monitor is UP',
        monitorName: 'ClickBit Website',
        monitorUrl: 'https://clickbit.com.au',
        status: 'up',
        time: new Date().toISOString(),
        heartbeat: {
          status: 'up',
          msg: 'HTTP 200 - OK',
          ping: 234
        }
      }
    },
    {
      name: 'Monitor Paused Test',
      payload: {
        msg: 'Monitor is PAUSED',
        monitorName: 'ClickBit API',
        monitorUrl: 'https://clickbit.com.au/api',
        status: 'paused',
        time: new Date().toISOString()
      }
    }
  ];

  console.log('🧪 Testing Uptime Kuma Webhook API\n');
  console.log(`📍 Endpoint: ${webhookUrl}\n`);

  for (const test of testPayloads) {
    try {
      console.log(`\n📤 Testing: ${test.name}`);
      console.log(`   Payload:`, JSON.stringify(test.payload, null, 2));
      
      const response = await axios.post(webhookUrl, test.payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log(`   ✅ Success! Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2));
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      if (error.response) {
        console.log(`   ❌ Error! Status: ${error.response.status}`);
        console.log(`   Response:`, JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log(`   ❌ Network Error: No response received`);
        console.log(`   Error:`, error.message);
      } else {
        console.log(`   ❌ Error:`, error.message);
      }
    }
  }

  console.log('\n\n✅ Test completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Check your admin panel notification icon');
  console.log('   2. You should see toast notifications appear');
  console.log('   3. Check the notifications dropdown for the new notifications');
};

// Run the test
testWebhook().catch(console.error);

