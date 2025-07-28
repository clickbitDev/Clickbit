const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

// Create transporter for sending emails
const createTransporter = async () => {
  // Priority 1: Hostinger SMTP (for production)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    logger.info('Using Hostinger SMTP configuration');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // For some SMTP servers
      }
    });
  }
  
  // Priority 2: Use environment variables for SMTP settings
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    logger.info('Using generic SMTP configuration');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Priority 3: Use Gmail (for testing - you'll need to enable "Less secure app access" or use App Password)
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    logger.info('Using Gmail SMTP configuration for testing');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }
  
  // Priority 4: Use Ethereal Email for testing (creates a fake SMTP server)
  logger.warn('No production/Gmail email configuration found. Falling back to Ethereal Email for testing.');
  
  // Generate test account
  let testAccount;
  try {
    testAccount = await nodemailer.createTestAccount();
    logger.info(`Ethereal test account created: User: ${testAccount.user}, Pass: ${testAccount.pass}`);
  } catch (err) {
    logger.error('Failed to create Ethereal test account:', err);
    throw new Error('Could not create Ethereal test account for email sending.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  logger.info('Ethereal transporter created.');
  return transporter;
};

// Email templates
const emailTemplates = {
  project_submission: (data) => ({
    subject: 'Client Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1FBBD2;">New Project Submission</h2>
        
        <h3>Client Information</h3>
        <p><strong>Client Name:</strong> ${data.clientName || 'N/A'}</p>
        <p><strong>Primary Contact:</strong> ${data.primaryContact || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.contactEmail || 'N/A'}</p>
        <p><strong>Contact Number:</strong> ${data.contactNumber || 'N/A'}</p>
        <p><strong>Company:</strong> ${data.companyName || 'N/A'}</p>
        <p><strong>Industry:</strong> ${data.industry || 'N/A'}</p>
        
        <h3>Project Details</h3>
        <p><strong>Project Name:</strong> ${data.projectName || 'N/A'}</p>
        <p><strong>Project Description:</strong> ${data.projectDescription || 'N/A'}</p>
        <p><strong>Business Objectives:</strong> ${data.businessObjectives || 'N/A'}</p>
        <p><strong>Target Audience:</strong> ${data.targetAudience || 'N/A'}</p>
        <p><strong>Budget:</strong> ${data.budget ? `$${data.budget} AUD` : 'Not specified'}</p>
        <p><strong>Start Date:</strong> ${data.startDate || 'Not specified'}</p>
        <p><strong>End Date:</strong> ${data.endDate || 'Not specified'}</p>
        <p><strong>Milestones:</strong> ${data.milestones || 'Not specified'}</p>
        
        <h3>Additional Information</h3>
        <p><strong>Client Background:</strong> ${data.clientBackground || 'Not provided'}</p>
        <p><strong>Stakeholders:</strong> ${data.stakeholders || 'Not provided'}</p>
        <p><strong>Initial Goals:</strong> ${data.initialGoals || 'Not provided'}</p>
        <p><strong>Project Constraints:</strong> ${data.projectConstraints || 'Not provided'}</p>
        <p><strong>Future Expansion:</strong> ${data.futureExpansion || 'Not provided'}</p>
        
        <h3>Selected Services</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${JSON.stringify(data.selectedServices, null, 2)}</pre>
        
        <h3>Selected Features</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${JSON.stringify(data.selectedFeatures, null, 2)}</pre>
        
        <hr style="margin: 20px 0;">
        <p><small>Submission ID: ${data.submissionId || 'N/A'}</small></p>
        <p><small>Submitted via Power Your Project form</small></p>
      </div>
    `,
    text: `
New Project Submission

Client Information:
- Client Name: ${data.clientName || 'N/A'}
- Primary Contact: ${data.primaryContact || 'N/A'}
- Email: ${data.contactEmail || 'N/A'}
- Contact Number: ${data.contactNumber || 'N/A'}
- Company: ${data.companyName || 'N/A'}
- Industry: ${data.industry || 'N/A'}

Project Details:
- Project Name: ${data.projectName || 'N/A'}
- Project Description: ${data.projectDescription || 'N/A'}
- Business Objectives: ${data.businessObjectives || 'N/A'}
- Target Audience: ${data.targetAudience || 'N/A'}
- Budget: ${data.budget ? `$${data.budget} AUD` : 'Not specified'}
- Start Date: ${data.startDate || 'Not specified'}
- End Date: ${data.endDate || 'Not specified'}
- Milestones: ${data.milestones || 'Not specified'}

Additional Information:
- Client Background: ${data.clientBackground || 'Not provided'}
- Stakeholders: ${data.stakeholders || 'Not provided'}
- Initial Goals: ${data.initialGoals || 'Not provided'}
- Project Constraints: ${data.projectConstraints || 'Not provided'}
- Future Expansion: ${data.futureExpansion || 'Not provided'}

Selected Services: ${JSON.stringify(data.selectedServices, null, 2)}
Selected Features: ${JSON.stringify(data.selectedFeatures, null, 2)}

Submission ID: ${data.submissionId || 'N/A'}
Submitted via Power Your Project form
    `
  }),
  
  new_contact_submission: (data) => ({
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1FBBD2;">New Contact Form Submission</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        
        <h3>Message</h3>
        <p>${data.message}</p>
        
        <hr style="margin: 20px 0;">
        <p><small>Submitted via website contact form</small></p>
      </div>
    `,
    text: `
New Contact Form Submission

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Subject: ${data.subject}

Message:
${data.message}

Submitted via website contact form
    `
  }),

  emailVerification: (data) => ({
    subject: 'Verify Your Email for Clickbit.com.au',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1FBBD2;">Email Verification</h2>
        
        <p>Hello ${data.name},</p>
        
        <p>Thank you for registering with Clickbit.com.au! To activate your account and get started, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #1FBBD2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
        
        <p>If you did not register for an account with Clickbit.com.au, please ignore this email.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Clickbit.com.au. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
    text: `
Email Verification

Hello ${data.name},

Thank you for registering with Clickbit.com.au! To activate your account and get started, please verify your email address by clicking the following link:
${data.verificationUrl}

If you did not register for an account with Clickbit.com.au, please ignore this email.

--
Clickbit.com.au
    `
  }),

  passwordReset: (data) => ({
    subject: 'Clickbit.com.au - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1FBBD2;">Password Reset Request</h2>
        
        <p>Hello ${data.name},</p>
        
        <p>We received a request to reset your password for your Clickbit.com.au account.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #1FBBD2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Clickbit.com.au. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
    text: `
Password Reset Request

Hello ${data.name},

We received a request to reset your password for your Clickbit.com.au account.

To reset your password, click on the following link:
${data.resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, you can safely ignore this email.

--
Clickbit.com.au
    `
  })
};

// Send email
const sendEmail = async (options) => {
  const transporter = await createTransporter();

  // Handle template-based emails
  let emailContent = {};
  if (options.template && emailTemplates[options.template]) {
    emailContent = emailTemplates[options.template](options.data || {});
  }

  // Define email options
  const mailOptions = {
    from: process.env.SMTP_USER || process.env.FROM_EMAIL || 'contact@clickbit.com.au',
    to: options.to,
    subject: options.subject || emailContent.subject,
    html: options.html || emailContent.html,
    text: options.text || emailContent.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully:', {
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info),
      to: options.to,
      subject: options.subject,
      response: info.response, // Log the full SMTP response
    });
    return info;
  } catch (error) {
    logger.error('Error sending email:', {
      error: error.message,
      stack: error.stack,
      to: options.to,
      subject: options.subject,
    });
    throw error;
  }
};

module.exports = {
  sendEmail
}; 