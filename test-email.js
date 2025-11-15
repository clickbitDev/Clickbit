const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { sendEmail } = require('./server/services/emailService');
const { logger } = require('./server/utils/logger');

const testEmail = async () => {
  const recipientEmail = 'muhitkhan.taosif@gmail.com';
  
  try {
    console.log('\n=== Email Configuration Check ===');
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST ? `Set (${process.env.SMTP_HOST})` : 'Not set'}`);
    console.log(`SMTP_USER: ${process.env.SMTP_USER ? `Set (${process.env.SMTP_USER})` : 'Not set'}`);
    console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? 'Set (***hidden***)' : 'Not set'}`);
    console.log(`SMTP_PORT: ${process.env.SMTP_PORT || 'Not set (default: 587)'}`);
    console.log(`SMTP_SECURE: ${process.env.SMTP_SECURE || 'Not set (default: false)'}`);
    console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL || 'Not set'}`);
    console.log(`GMAIL_USER: ${process.env.GMAIL_USER ? 'Set' : 'Not set'}`);
    console.log(`GMAIL_PASS: ${process.env.GMAIL_PASS ? 'Set' : 'Not set'}`);
    console.log('================================\n');
    
    logger.info('Starting email test...');
    logger.info('Email configuration check:');
    logger.info(`SMTP_HOST: ${process.env.SMTP_HOST ? 'Set' : 'Not set'}`);
    logger.info(`SMTP_USER: ${process.env.SMTP_USER ? 'Set' : 'Not set'}`);
    logger.info(`SMTP_PASS: ${process.env.SMTP_PASS ? 'Set' : 'Not set'}`);
    logger.info(`SMTP_PORT: ${process.env.SMTP_PORT || 'Not set'}`);
    logger.info(`SMTP_SECURE: ${process.env.SMTP_SECURE || 'Not set'}`);
    
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: 'Test Email from ClickBIT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1FBBD2;">Test Email</h2>
          <p>This is a test email from ClickBIT to verify that email configuration is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Server:</strong> ${process.env.SMTP_HOST || 'Not configured'}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            If you received this email, the email service is configured correctly!
          </p>
        </div>
      `,
      text: `Test Email\n\nThis is a test email from ClickBIT to verify that email configuration is working correctly.\n\nTimestamp: ${new Date().toLocaleString()}\nServer: ${process.env.SMTP_HOST || 'Not configured'}\n\nIf you received this email, the email service is configured correctly!`
    });
    
    logger.info('✅ Email sent successfully!');
    logger.info('Email details:', {
      messageId: emailResult.messageId,
      to: recipientEmail,
      previewURL: emailResult.previewURL || 'N/A (production email)'
    });
    
    if (emailResult.previewURL) {
      console.log('\n📧 Preview URL (for testing):', emailResult.previewURL);
    }
    
    console.log(`\n✅ Test email sent successfully to ${recipientEmail}`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to send test email:', {
      error: error.message,
      stack: error.stack
    });
    console.error(`\n❌ Error sending email: ${error.message}`);
    process.exit(1);
  }
};

testEmail();

