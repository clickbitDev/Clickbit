const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(
    process.env.DB_NAME || 'clickbitdb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

// Contact model
const Contact = sequelize.define('Contact', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    subject: Sequelize.STRING,
    message: Sequelize.TEXT,
    contact_type: Sequelize.ENUM('general', 'support', 'sales', 'feedback', 'complaint', 'partnership', 'other'),
    priority: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
    status: Sequelize.ENUM('new', 'in_progress', 'resolved', 'closed'),
    custom_fields: Sequelize.JSON,
    source: Sequelize.STRING,
    ip_address: Sequelize.STRING,
    tags: Sequelize.JSON,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
}, {
    tableName: 'contacts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

async function viewSubmission(contactId) {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        const contact = await Contact.findByPk(contactId);
        
        if (!contact) {
            console.log(`❌ No contact found with ID ${contactId}`);
            return;
        }

        console.log('\n📋 CONTACT SUBMISSION DETAILS');
        console.log('=' .repeat(50));
        
        console.log(`\n🆔 Contact ID: ${contact.id}`);
        console.log(`📅 Created: ${contact.created_at}`);
        console.log(`📊 Status: ${contact.status}`);
        console.log(`🎯 Priority: ${contact.priority}`);
        console.log(`📝 Type: ${contact.contact_type}`);
        console.log(`🌐 Source: ${contact.source}`);
        console.log(`📍 IP Address: ${contact.ip_address}`);

        console.log('\n📞 BASIC INFORMATION');
        console.log('-'.repeat(30));
        console.log(`Name: ${contact.name}`);
        console.log(`Email: ${contact.email}`);
        console.log(`Phone: ${contact.phone}`);
        console.log(`Subject: ${contact.subject}`);
        console.log(`Message: ${contact.message}`);

        if (contact.custom_fields) {
            console.log('\n📋 COMPLETE FORM DATA');
            console.log('-'.repeat(30));
            console.log(JSON.stringify(contact.custom_fields, null, 2));
        }

        if (contact.tags) {
            console.log('\n🏷️ TAGS');
            console.log('-'.repeat(30));
            console.log(JSON.stringify(contact.tags, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

// Get contact ID from command line argument
const contactId = process.argv[2];

if (!contactId) {
    console.log('Usage: node view-submission.js <contact_id>');
    console.log('Example: node view-submission.js 6');
    process.exit(1);
}

viewSubmission(parseInt(contactId)); 