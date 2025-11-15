#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the database connection directly using the application's database configuration
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { connectDatabase, sequelize } = require('../server/config/database');
const { logger } = require('../server/utils/logger');

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...\n');
  
  // Display connection info (without password)
  console.log('Database Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log(`  Database: ${process.env.DB_NAME || 'clickbitdb'}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'}\n`);

  try {
    // Test authentication
    console.log('Step 1: Testing database authentication...');
    await sequelize.authenticate();
    console.log('✅ Database authentication successful\n');

    // Test query
    console.log('Step 2: Testing database query...');
    const [results] = await sequelize.query('SELECT 1+1 AS result');
    const [timeResults] = await sequelize.query('SELECT NOW() AS current_time, DATABASE() AS current_database');
    console.log('✅ Database query successful');
    console.log(`   Result: ${results[0].result}`);
    console.log(`   Current Time: ${timeResults[0].current_time}`);
    console.log(`   Current Database: ${timeResults[0].current_database}\n`);

    // Test table access
    console.log('Step 3: Testing table access...');
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log(`✅ Successfully accessed database`);
    console.log(`   Tables found: ${tables.length}\n`);

    // Test a simple count query on a common table
    try {
      const [countResult] = await sequelize.query('SELECT COUNT(*) as count FROM users LIMIT 1');
      console.log(`✅ Sample query on 'users' table successful`);
      console.log(`   Users count: ${countResult[0]?.count || 'N/A'}\n`);
    } catch (err) {
      console.log(`⚠️  Could not query 'users' table (this is okay if table doesn't exist): ${err.message}\n`);
    }

    console.log('✅✅✅ Database connection test PASSED ✅✅✅\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌❌❌ Database connection test FAILED ❌❌❌\n');
    console.error('Error Details:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  SQL State: ${error.sqlState || 'N/A'}\n`);
    
    console.error('Troubleshooting Tips:');
    console.error('  1. Check if MySQL server is running');
    console.error('  2. Verify database credentials in .env file');
    console.error('  3. Ensure database exists: CREATE DATABASE clickbitdb;');
    console.error('  4. Check firewall settings');
    console.error('  5. Verify network connectivity to database host\n');
    
    process.exit(1);
  } finally {
    // Close connection
    try {
      await sequelize.close();
    } catch (err) {
      // Ignore close errors
    }
  }
}

// Run the test
testDatabaseConnection().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

