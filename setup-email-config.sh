#!/bin/bash

# Email Configuration Setup Script for ClickBit Website
# This script helps you set up the .env file with Hostinger SMTP settings

echo "Setting up email configuration for ClickBit Website..."
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "Found existing .env file. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env file with Hostinger SMTP configuration
cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=clickbitdb

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Email Configuration - Hostinger SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@clickbit.com.au
SMTP_PASS=!Mo@OP5d&pn4OH7@
FROM_EMAIL=contact@clickbit.com.au

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
EOF

echo "✅ Email configuration created successfully!"
echo ""
echo "📧 Hostinger SMTP Settings:"
echo "   - SMTP Server: smtp.hostinger.com"
echo "   - Port: 587 (TLS)"
echo "   - Email: contact@clickbit.com.au"
echo "   - Security: TLS"
echo ""
echo "🔧 Next steps:"
echo "   1. Update the JWT_SECRET with a secure random string"
echo "   2. Update database credentials if needed"
echo "   3. Restart the server: npm run server"
echo ""
echo "🧪 To test the email configuration:"
echo "   - Submit a form at http://localhost:3000/power-your-project"
echo "   - Check the server logs for email sending status"
echo "   - Check your email at contact@clickbit.com.au" 