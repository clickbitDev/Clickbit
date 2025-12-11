require('dotenv').config();
const { SiteSetting } = require('./server/models');

async function updateBillingCodes() {
  try {
    console.log('🔄 Updating billing settings with Stripe keys...');
    
    const billingData = {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      paypalClientId: '',
      paypalClientSecret: '',
      currencyCode: 'AUD',
      taxRate: 10, // GST for Australia
      companyAbn: '',
      billingAddress: '44 Shoreline Road, Moorebank NSW 2170, Australia',
      paymentTerms: 'Net 30'
    };

    const [setting, created] = await SiteSetting.findOrCreate({
      where: { setting_key: 'billing_settings' },
      defaults: {
        setting_key: 'billing_settings',
        setting_value: JSON.stringify(billingData),
        setting_type: 'billing',
        description: 'Payment and billing configuration settings',
        is_public: false,
        auto_load: false
      }
    });

    if (!created) {
      await setting.update({
        setting_value: JSON.stringify(billingData)
      });
    }

    console.log('✅ Billing settings updated successfully!');
    console.log('💳 Current settings:');
    console.log('- Stripe Publishable Key:', billingData.stripePublishableKey ? 'Set' : 'Not set');
    console.log('- Stripe Secret Key:', billingData.stripeSecretKey ? 'Set' : 'Not set');
    console.log('- Currency:', billingData.currencyCode);
    console.log('- Tax Rate:', billingData.taxRate + '%');
    console.log('- Billing Address:', billingData.billingAddress);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating billing settings:', error);
    process.exit(1);
  }
}

updateBillingCodes();
