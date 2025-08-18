const { backupContentTable } = require('./backup-content-table');
const { migrateContentData } = require('./migrate-content-data');

/**
 * Complete migration process with backup
 */
async function runCompleteMigration() {
  console.log('🚀 Starting complete content migration process...\n');
  
  try {
    // Step 1: Create backup
    console.log('Step 1: Creating backup of existing content table...');
    const backupFile = await backupContentTable();
    console.log(`✅ Backup completed: ${backupFile}\n`);
    
    // Step 2: Run migration
    console.log('Step 2: Migrating content to new table structure...');
    await migrateContentData();
    console.log('✅ Migration completed successfully!\n');
    
    console.log('🎉 Complete migration process finished successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test the application to ensure everything works correctly');
    console.log('2. If issues occur, you can restore from backup using:');
    console.log(`   node backup-content-table.js restore "${backupFile}"`);
    console.log('3. Once confirmed working, you can optionally remove the old contents table');
    console.log('4. Consider updating any remaining references to the old content structure');
    
  } catch (error) {
    console.error('\n❌ Migration process failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check database connection and permissions');
    console.log('2. Ensure all new tables exist (run database sync)');
    console.log('3. Check server logs for detailed error information');
    console.log('4. If backup was created, you can restore using the backup script');
    throw error;
  }
}

// Add command line option to run just migration without backup
const skipBackup = process.argv.includes('--skip-backup');
const forceBackup = process.argv.includes('--backup-only');

if (require.main === module) {
  if (forceBackup) {
    // Only run backup
    backupContentTable()
      .then((backupFile) => {
        console.log(`🎉 Backup completed! File: ${backupFile}`);
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Backup failed:', error);
        process.exit(1);
      });
  } else if (skipBackup) {
    // Only run migration
    migrateContentData()
      .then(() => {
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
      });
  } else {
    // Run complete process
    runCompleteMigration()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        process.exit(1);
      });
  }
}

module.exports = { runCompleteMigration };