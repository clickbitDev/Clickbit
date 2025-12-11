require('dotenv').config();
const { SiteSetting } = require('./server/models');

async function updateMarketingCodes() {
  try {
    console.log('🔄 Updating marketing integrations with existing codes...');
    
    const marketingData = {
      headerScripts: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>`,
      googleSearchConsoleTag: 'FQDzsv5yqc4-86Y8cX5IO1j1PNlwiGXywjC7tE7Pzas',
      googleAnalyticsId: 'G-G2SP59398M',
      facebookPixelId: '',
      customMetaTags: `<meta name="robots" content="index, follow" />
<meta name="author" content="ClickBit" />`
    };

    const [setting, created] = await SiteSetting.findOrCreate({
      where: { setting_key: 'marketing_integrations' },
      defaults: {
        setting_key: 'marketing_integrations',
        setting_value: JSON.stringify(marketingData),
        setting_type: 'marketing',
        description: 'Marketing and analytics integration settings',
        is_public: false,
        auto_load: false
      }
    });

    if (!created) {
      await setting.update({
        setting_value: JSON.stringify(marketingData)
      });
    }

    console.log('✅ Marketing integrations updated successfully!');
    console.log('📊 Current settings:');
    console.log('- Google Analytics ID:', marketingData.googleAnalyticsId);
    console.log('- Google Search Console Tag:', marketingData.googleSearchConsoleTag);
    console.log('- Facebook Pixel ID:', marketingData.facebookPixelId || 'Not set');
    console.log('- Custom Meta Tags:', marketingData.customMetaTags ? 'Set' : 'Not set');
    console.log('- Header Scripts:', marketingData.headerScripts ? 'Set' : 'Not set');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating marketing integrations:', error);
    process.exit(1);
  }
}

updateMarketingCodes();
