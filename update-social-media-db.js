const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clickbitdb'
};

async function updateSocialMediaLinks() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Check if contact-info content exists
    const [rows] = await connection.execute(
      'SELECT * FROM contents WHERE slug = ? AND content_type = ?',
      ['contact-info', 'custom']
    );
    
    if (rows.length === 0) {
      console.log('📝 Creating new contact-info content...');
      
      const updatedContactInfo = {
        phone1: '+61 2 7229 9577',
        phone2: '+61 422 512 130',
        email: 'info@clickbit.com.au',
        address: '44 Shoreline Road\nMoorebank NSW 2170\nAustralia',
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nWeekend: By appointment',
        googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.643330663454!2d150.9133093152115!3d-33.9249269806403!2m3!1m2!1s0x6b1295a3c9a35e7d%3A0x8f4f4c9c1c4f2e5a!2s44%20Shoreline%20Rd%2C%20Moorebank%20NSW%202170%2C%20Australia!5e0!3m2!1sen!2sau!4v1620211993456!5m2!1sen!2sus',
        socialLinks: [
          { platform: 'facebook', url: 'https://www.facebook.com/clickbitau/' },
          { platform: 'instagram', url: 'https://www.instagram.com/clickbitau/' },
          { platform: 'linkedin', url: 'https://www.linkedin.com/company/clickbitau/' },
          { platform: 'twitter', url: 'https://x.com/ClickBITau' },
          { platform: 'youtube', url: 'https://www.youtube.com/@clickbitau' },
          { platform: 'github', url: 'https://github.com/clickbitau' }
        ]
      };
      
      await connection.execute(
        'INSERT INTO contents (slug, content_type, content, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        ['contact-info', 'custom', JSON.stringify(updatedContactInfo)]
      );
      
      console.log('✅ Created new contact-info content with all 6 social media platforms');
      
    } else {
      console.log('📝 Updating existing contact-info content...');
      
      const existingContent = JSON.parse(rows[0].content);
      
      // Update social links to include all 6 platforms
      existingContent.socialLinks = [
        { platform: 'facebook', url: 'https://www.facebook.com/clickbitau/' },
        { platform: 'instagram', url: 'https://www.instagram.com/clickbitau/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/clickbitau/' },
        { platform: 'twitter', url: 'https://x.com/ClickBITau' },
        { platform: 'youtube', url: 'https://www.youtube.com/@clickbitau' },
        { platform: 'github', url: 'https://github.com/clickbitau' }
      ];
      
      await connection.execute(
        'UPDATE contents SET content = ?, updated_at = NOW() WHERE slug = ? AND content_type = ?',
        [JSON.stringify(existingContent), 'contact-info', 'custom']
      );
      
      console.log('✅ Updated existing contact-info content with all 6 social media platforms');
    }
    
    // Also check SiteSetting table for contact_info
    const [siteSettings] = await connection.execute(
      'SELECT * FROM site_settings WHERE setting_key = ?',
      ['contact_info']
    );
    
    if (siteSettings.length > 0) {
      console.log('📝 Updating SiteSetting contact_info...');
      
      const existingSetting = JSON.parse(siteSettings[0].setting_value);
      existingSetting.socialLinks = [
        { platform: 'facebook', url: 'https://www.facebook.com/clickbitau/' },
        { platform: 'instagram', url: 'https://www.instagram.com/clickbitau/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/clickbitau/' },
        { platform: 'twitter', url: 'https://x.com/ClickBITau' },
        { platform: 'youtube', url: 'https://www.youtube.com/@clickbitau' },
        { platform: 'github', url: 'https://github.com/clickbitau' }
      ];
      
      await connection.execute(
        'UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
        [JSON.stringify(existingSetting), 'contact_info']
      );
      
      console.log('✅ Updated SiteSetting contact_info with all 6 social media platforms');
    }
    
    console.log('🎉 Database update completed successfully!');
    console.log('📱 All 6 social media platforms are now stored in the database:');
    console.log('   - Facebook: https://www.facebook.com/clickbitau/');
    console.log('   - Instagram: https://www.instagram.com/clickbitau/');
    console.log('   - LinkedIn: https://www.linkedin.com/company/clickbitau/');
    console.log('   - Twitter: https://x.com/ClickBITau');
    console.log('   - YouTube: https://www.youtube.com/@clickbitau');
    console.log('   - GitHub: https://github.com/clickbitau');
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the update
updateSocialMediaLinks();
