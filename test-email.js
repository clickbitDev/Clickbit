const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
const testEmailConfig = async () => {
  console.log('🧪 Testing Hostinger SMTP Configuration...\n');
  
  // Display current configuration
  console.log('📧 Current SMTP Settings:');
  console.log(`   Host: ${process.env.SMTP_HOST || 'Not set'}`);
  console.log(`   Port: ${process.env.SMTP_PORT || 'Not set'}`);
  console.log(`   User: ${process.env.SMTP_USER || 'Not set'}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE || 'Not set'}`);
  console.log(`   From: ${process.env.FROM_EMAIL || 'Not set'}\n`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'info@clickbit.com.au',
      subject: 'Test Email - ClickBit Website SMTP Configuration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1FBBD2;">SMTP Test Email</h2>
          <p>This is a test email to verify that the Hostinger SMTP configuration is working correctly.</p>
          
          <h3>Configuration Details:</h3>
          <ul>
            <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
            <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</li>
            <li><strong>SMTP User:</strong> ${process.env.SMTP_USER}</li>
            <li><strong>From Email:</strong> ${process.env.FROM_EMAIL}</li>
          </ul>
          
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          
          <hr style="margin: 20px 0;">
          <p><small>This email was sent automatically by the ClickBit Website email test script.</small></p>
        </div>
      `,
      text: `
SMTP Test Email

This is a test email to verify that the Hostinger SMTP configuration is working correctly.

Configuration Details:
- SMTP Host: ${process.env.SMTP_HOST}
- SMTP Port: ${process.env.SMTP_PORT}
- SMTP User: ${process.env.SMTP_USER}
- From Email: ${process.env.FROM_EMAIL}

Timestamp: ${new Date().toISOString()}

This email was sent automatically by the ClickBit Website email test script.
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info) || 'N/A'}\n`);
    
    console.log('🎉 Email configuration is working perfectly!');
    console.log('You can now submit forms at http://localhost:3000/power-your-project');
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check your email and password are correct');
      console.log('   2. Make sure 2FA is disabled or use an app password');
      console.log('   3. Verify the SMTP settings with Hostinger support');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the SMTP host and port are correct');
      console.log('   3. Check if your firewall is blocking the connection');
    }
  }
};

// Run the test
testEmailConfig(); 