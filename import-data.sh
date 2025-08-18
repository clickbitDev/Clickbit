#!/bin/bash

# ClickBit Database Import Script
echo "🗄️  ClickBit Database Import"
echo "============================="

# Database configuration
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="root"
DB_NAME="clickbitdb"
SQL_FILE="final data (1).sql"

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Error: SQL file '$SQL_FILE' not found!"
    echo "   Please make sure the file is in the project root directory."
    exit 1
fi

echo "📁 Found SQL file: $SQL_FILE"

# Check if MySQL is accessible
echo "🔍 Checking MySQL connection..."
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Error: Cannot connect to MySQL!"
    echo "   Please make sure MAMP is running and MySQL is accessible."
    echo "   Connection details:"
    echo "   - Host: $DB_HOST"
    echo "   - Port: $DB_PORT"
    echo "   - User: $DB_USER"
    echo "   - Database: $DB_NAME"
    exit 1
fi

echo "✅ MySQL connection successful!"

# Create database if it doesn't exist
echo "🏗️  Creating database if it doesn't exist..."
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to create database!"
    exit 1
fi

echo "✅ Database '$DB_NAME' ready!"

# Import the SQL file
echo "📥 Importing data from $SQL_FILE..."
echo "   This may take a few moments..."

mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SQL_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to import SQL file!"
    echo "   Please check the SQL file for any syntax errors."
    exit 1
fi

echo "✅ Data imported successfully!"

# Verify the import
echo "🔍 Verifying imported data..."

# Check if key tables exist and have data
SERVICES_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM services;" 2>/dev/null)
USERS_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM users;" 2>/dev/null)
REVIEWS_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM reviews;" 2>/dev/null)

echo "📊 Data Summary:"
echo "   - Services: $SERVICES_COUNT"
echo "   - Users: $USERS_COUNT"  
echo "   - Reviews: $REVIEWS_COUNT"

if [ "$SERVICES_COUNT" -gt 0 ] && [ "$USERS_COUNT" -gt 0 ]; then
    echo "✅ Database import completed successfully!"
    echo ""
    echo "🎉 Your ClickBit database is now ready with comprehensive data!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Make sure your .env file has the correct MySQL settings:"
    echo "      DB_HOST=localhost"
    echo "      DB_PORT=3306"
    echo "      DB_USER=root"
    echo "      DB_PASSWORD=root"
    echo "      DB_NAME=clickbitdb"
    echo ""
    echo "   2. Start your backend server:"
    echo "      npm start"
    echo ""
    echo "   3. Your application will now use the MySQL database with all the comprehensive data!"
else
    echo "⚠️  Warning: Data import may not have completed properly."
    echo "   Please check the MySQL database manually."
fi 