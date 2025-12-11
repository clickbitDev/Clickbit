const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

/**
 * Backup script to export the contents table data before migration
 */
async function backupContentTable() {
  console.log('💾 Starting content table backup...');
  
  try {
    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `content-backup-${timestamp}.json`);
    
    console.log('📊 Querying contents table...');
    
    // Query all data from contents table
    const [results] = await sequelize.query(`
      SELECT * FROM contents ORDER BY created_at ASC
    `);
    
    console.log(`📈 Found ${results.length} records to backup`);
    
    // Prepare backup data with metadata
    const backupData = {
      metadata: {
        timestamp: new Date().toISOString(),
        recordCount: results.length,
        backupVersion: '1.0',
        description: 'Backup of contents table before migration to dedicated tables'
      },
      data: results
    };
    
    // Write backup to file
    console.log(`💾 Writing backup to: ${backupFile}`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log('✅ Backup completed successfully!');
    console.log(`📁 Backup saved to: ${backupFile}`);
    console.log(`📊 Records backed up: ${results.length}`);
    
    return backupFile;
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

/**
 * Restore content table from backup (if needed)
 */
async function restoreContentTable(backupFile) {
  console.log(`🔄 Restoring content table from: ${backupFile}`);
  
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }
    
    // Read backup data
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    const records = backupData.data;
    
    console.log(`📊 Found ${records.length} records to restore`);
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    // await sequelize.query('DELETE FROM contents');
    
    // Insert records back
    let restored = 0;
    for (const record of records) {
      try {
        // Build insert query
        const columns = Object.keys(record).map(key => `\`${key}\``).join(', ');
        const values = Object.values(record).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          if (value instanceof Date) return `'${value.toISOString()}'`;
          return `'${value}'`;
        }).join(', ');
        
        await sequelize.query(`
          INSERT INTO contents (${columns}) VALUES (${values})
        `);
        
        restored++;
      } catch (error) {
        console.error(`⚠️  Failed to restore record ${record.id}:`, error.message);
      }
    }
    
    console.log(`✅ Restored ${restored}/${records.length} records successfully!`);
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

// Run backup if called directly
if (require.main === module) {
  const action = process.argv[2];
  const backupFile = process.argv[3];
  
  if (action === 'restore' && backupFile) {
    restoreContentTable(backupFile)
      .then(() => {
        console.log('🎉 Restore completed successfully!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Restore failed:', error);
        process.exit(1);
      });
  } else {
    backupContentTable()
      .then((backupFile) => {
        console.log(`🎉 Backup completed successfully! File: ${backupFile}`);
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Backup failed:', error);
        process.exit(1);
      });
  }
}

module.exports = { backupContentTable, restoreContentTable };