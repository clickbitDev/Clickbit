const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');

const router = express.Router();

// Define validation chains
const contactValidation = [
    body('firstName').trim().notEmpty().withMessage('First name is required.'),
    body('lastName').trim().notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required.'),
    body('phone').optional({ checkFalsy: true }).trim().isMobilePhone('any').withMessage('Invalid phone number.'),
];

const projectValidation = [
    body('clientName').trim().notEmpty().withMessage('Client name is required.'),
    body('projectName').trim().notEmpty().withMessage('Project name is required.'),
    body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
];


// POST /api/contact - A single endpoint to handle all form submissions
router.post('/', async (req, res) => {
    const { type } = req.body;

    try {
        if (type === 'contact') {
            // Run validation
            await Promise.all(contactValidation.map(validation => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Process and save
            const { firstName, lastName, email, message, phone } = req.body;
            const name = `${firstName} ${lastName}`;
            const subject = 'Website Contact Form Submission';

            const newContact = await Contact.create({
                name,
                email,
                subject,
                message,
                phone,
                contact_type: 'general',
                priority: 'medium',
                status: 'new',
                source: 'Website Contact Form',
                ip_address: req.ip,
            });

            logger.info('Contact form submission saved.', { id: newContact.id });

            const htmlBody = `
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `;

            try {
                await sendEmail({
                    to: 'contact@clickbit.com.au',
                    subject: `New Inquiry from ${name}`,
                    html: htmlBody,
                    text: `New contact form submission from ${name} (${email}). Message: ${message}`,
                });
                
                return res.status(201).json({ message: 'Thank you for your message! We will get back to you soon.' });
            } catch (emailError) {
                logger.error('Email sending failed for contact form:', {
                    error: emailError.message,
                    contactId: newContact.id,
                    to: 'contact@clickbit.com.au'
                });
                
                // Form saved successfully but email failed - still return success but log the issue
                return res.status(201).json({ 
                    message: 'Thank you for your message! We have received your submission and will get back to you soon.',
                    warning: 'Email notification may be delayed.'
                });
            }

        } else if (type === 'project') {
            // Handle Power Your Project form submission
            const {
                clientName, primaryContact, email, contactNumber, companyName, companyAddress, industry,
                projectName, projectDescription, businessObjectives, targetAudience, budget, startDate, endDate,
                milestones, clientBackground, stakeholders, initialGoals, projectConstraints, futureExpansion,
                selectedServices, selectedFeatures, signature, agreed
            } = req.body;

            // Save to database first
            let newContact;
            try {
                newContact = await Contact.create({
                    name: clientName || primaryContact,
                    email,
                    subject: `Project Submission: ${projectName}`,
                    message: projectDescription || 'Project details submitted via Power Your Project form.',
                    phone: contactNumber,
                    contact_type: 'sales',
                    priority: 'high',
                    status: 'new',
                    source: 'Power Your Project Form',
                    ip_address: req.ip,
                    custom_fields: req.body,
                });

                logger.info('Project submission saved.', { id: newContact.id });
            } catch (dbError) {
                logger.error('Database save failed for project submission:', {
                    error: dbError.message,
                    stack: dbError.stack,
                    email: email
                });
                
                if (dbError.message.includes('Unknown column')) {
                    return res.status(500).json({ 
                        message: 'Database configuration issue. Please contact support.',
                        error: 'SCHEMA_ERROR'
                    });
                }
                
                return res.status(500).json({ 
                    message: 'Failed to save your submission. Please check your data and try again.',
                    error: 'DATABASE_ERROR'
                });
            }

            // Create comprehensive project email
            const projectHtmlBody = `
                <h1>New Project Submission - Power Your Project Form</h1>
                
                <h2>Client Information</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Client Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${clientName || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Primary Contact:</td><td style="padding: 8px; border: 1px solid #ddd;">${primaryContact || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;">${email || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td><td style="padding: 8px; border: 1px solid #ddd;">${contactNumber || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company:</td><td style="padding: 8px; border: 1px solid #ddd;">${companyName || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Industry:</td><td style="padding: 8px; border: 1px solid #ddd;">${industry || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address:</td><td style="padding: 8px; border: 1px solid #ddd;">${companyAddress || 'Not provided'}</td></tr>
                </table>

                <h2>Project Details</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Project Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${projectName || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Description:</td><td style="padding: 8px; border: 1px solid #ddd;">${projectDescription || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business Objectives:</td><td style="padding: 8px; border: 1px solid #ddd;">${businessObjectives || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Target Audience:</td><td style="padding: 8px; border: 1px solid #ddd;">${targetAudience || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Budget:</td><td style="padding: 8px; border: 1px solid #ddd;">${budget || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Start Date:</td><td style="padding: 8px; border: 1px solid #ddd;">${startDate || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">End Date:</td><td style="padding: 8px; border: 1px solid #ddd;">${endDate || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Milestones:</td><td style="padding: 8px; border: 1px solid #ddd;">${milestones || 'Not provided'}</td></tr>
                </table>

                <h2>Additional Context</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Client Background:</td><td style="padding: 8px; border: 1px solid #ddd;">${clientBackground || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Stakeholders:</td><td style="padding: 8px; border: 1px solid #ddd;">${stakeholders || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Initial Goals:</td><td style="padding: 8px; border: 1px solid #ddd;">${initialGoals || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Project Constraints:</td><td style="padding: 8px; border: 1px solid #ddd;">${projectConstraints || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Future Expansion:</td><td style="padding: 8px; border: 1px solid #ddd;">${futureExpansion || 'Not provided'}</td></tr>
                </table>

                ${selectedServices && Object.keys(selectedServices).length > 0 ? `
                <h2>Selected Services</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    ${Object.entries(selectedServices).map(([serviceId, service]) => `
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${service.name || serviceId}:</td><td style="padding: 8px; border: 1px solid #ddd;">$${service.price || 'Price not set'}</td></tr>
                    `).join('')}
                </table>
                ` : ''}

                ${selectedFeatures && Object.keys(selectedFeatures).length > 0 ? `
                <h2>Selected Features</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    ${Object.entries(selectedFeatures).map(([serviceId, features]) => `
                        ${Object.entries(features).map(([featureId, feature]) => `
                            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${feature.name || featureId}:</td><td style="padding: 8px; border: 1px solid #ddd;">$${feature.price || 'Price not set'}</td></tr>
                        `).join('')}
                    `).join('')}
                </table>
                ` : ''}

                <h2>Form Submission Details</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Terms Agreed:</td><td style="padding: 8px; border: 1px solid #ddd;">${agreed ? 'Yes' : 'No'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Signature:</td><td style="padding: 8px; border: 1px solid #ddd;">${signature || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submission Time:</td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
                </table>

                <p><strong>Full details are available in the database (Contact ID: ${newContact.id}).</strong></p>
            `;

            const projectTextBody = `
New Project Submission - Power Your Project Form

CLIENT INFORMATION:
Client Name: ${clientName || 'Not provided'}
Primary Contact: ${primaryContact || 'Not provided'}
Email: ${email || 'Not provided'}
Phone: ${contactNumber || 'Not provided'}
Company: ${companyName || 'Not provided'}
Industry: ${industry || 'Not provided'}
Address: ${companyAddress || 'Not provided'}

PROJECT DETAILS:
Project Name: ${projectName || 'Not provided'}
Description: ${projectDescription || 'Not provided'}
Business Objectives: ${businessObjectives || 'Not provided'}
Target Audience: ${targetAudience || 'Not provided'}
Budget: ${budget || 'Not provided'}
Start Date: ${startDate || 'Not provided'}
End Date: ${endDate || 'Not provided'}
Milestones: ${milestones || 'Not provided'}

ADDITIONAL CONTEXT:
Client Background: ${clientBackground || 'Not provided'}
Stakeholders: ${stakeholders || 'Not provided'}
Initial Goals: ${initialGoals || 'Not provided'}
Project Constraints: ${projectConstraints || 'Not provided'}
Future Expansion: ${futureExpansion || 'Not provided'}

SELECTED SERVICES:
${selectedServices ? Object.entries(selectedServices).map(([serviceId, service]) => `- ${service.name || serviceId}: $${service.price || 'Price not set'}`).join('\n') : 'None selected'}

SELECTED FEATURES:
${selectedFeatures ? Object.entries(selectedFeatures).map(([serviceId, features]) => 
    Object.entries(features).map(([featureId, feature]) => `- ${feature.name || featureId}: $${feature.price || 'Price not set'}`).join('\n')
).join('\n') : 'None selected'}

FORM SUBMISSION:
Terms Agreed: ${agreed ? 'Yes' : 'No'}
Signature: ${signature || 'Not provided'}
Submission Time: ${new Date().toLocaleString()}

Full details are available in the database (Contact ID: ${newContact.id}).
            `;

            // Try to send email, but don't fail the entire submission if email fails
            try {
                await sendEmail({
                    to: 'contact@clickbit.com.au',
                    subject: 'New Project Submission - Power Your Project Form',
                    html: projectHtmlBody,
                    text: projectTextBody,
                });

                return res.status(201).json({ 
                    message: "Thank you! We've received your project details and will be in touch shortly."
                });
            } catch (emailError) {
                logger.error('Email sending failed for project submission:', {
                    error: emailError.message,
                    stack: emailError.stack,
                    contactId: newContact.id,
                    to: 'contact@clickbit.com.au'
                });
                
                // Project saved successfully but email failed - still return success
                return res.status(201).json({ 
                    message: "Thank you! We've received your project details. Our team will review your submission and contact you soon.",
                    warning: 'Email notification may be delayed.'
                });
            }

        } else {
            return res.status(400).json({ message: 'Invalid form submission type.' });
        }
    } catch (error) {
        logger.error('Unexpected error processing form submission:', {
            error: error.message,
            stack: error.stack,
            submissionType: type,
            body: req.body,
        });
        
        res.status(500).json({ 
            message: 'An unexpected error occurred. Please try again later.',
            error: 'UNEXPECTED_ERROR'
        });
    }
});

module.exports = router; 