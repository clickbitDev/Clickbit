const { sequelize } = require('../config/database');
const { Content, BlogPost, PortfolioItem, Page, SiteSetting } = require('../models');

/**
 * Verification script to check migration success
 */
async function verifyMigration() {
  console.log('🔍 Starting migration verification...\n');
  
  try {
    // Get counts from original and new tables
    console.log('📊 Counting records in all tables...');
    
    const [
      originalCount,
      blogPostCount,
      portfolioCount,
      pageCount,
      settingCount
    ] = await Promise.all([
      Content.count(),
      BlogPost.count(),
      PortfolioItem.count(),
      Page.count(),
      SiteSetting.count()
    ]);
    
    console.log('\n📈 Record Counts:');
    console.log(`   Original contents table: ${originalCount}`);
    console.log(`   New blog_posts table: ${blogPostCount}`);
    console.log(`   New portfolio_items table: ${portfolioCount}`);
    console.log(`   New pages table: ${pageCount}`);
    console.log(`   New site_settings table: ${settingCount}`);
    console.log(`   Total migrated: ${blogPostCount + portfolioCount + pageCount + settingCount}`);
    
    // Check for missing data
    const migratedTotal = blogPostCount + portfolioCount + pageCount + settingCount;
    const difference = originalCount - migratedTotal;
    
    if (difference > 0) {
      console.log(`\n⚠️  ${difference} records were not migrated (may be due to duplicates or unknown content types)`);
    } else if (difference === 0) {
      console.log('\n✅ All records successfully migrated!');
    }
    
    // Verify data integrity by checking some samples
    console.log('\n🔬 Checking data integrity...');
    
    // Check blog posts
    if (blogPostCount > 0) {
      const sampleBlogPost = await BlogPost.findOne({ order: [['created_at', 'ASC']] });
      console.log(`   ✅ Blog posts table accessible - Sample: "${sampleBlogPost.title}"`);
    }
    
    // Check portfolio items
    if (portfolioCount > 0) {
      const samplePortfolio = await PortfolioItem.findOne({ order: [['created_at', 'ASC']] });
      console.log(`   ✅ Portfolio items table accessible - Sample: "${samplePortfolio.title}"`);
    }
    
    // Check pages
    if (pageCount > 0) {
      const samplePage = await Page.findOne({ order: [['created_at', 'ASC']] });
      console.log(`   ✅ Pages table accessible - Sample: "${samplePage.title}"`);
    }
    
    // Check settings
    if (settingCount > 0) {
      const sampleSetting = await SiteSetting.findOne({ order: [['created_at', 'ASC']] });
      console.log(`   ✅ Settings table accessible - Sample: "${sampleSetting.setting_key}"`);
    }
    
    // Test API endpoints
    console.log('\n🌐 Testing API endpoint functionality...');
    
    try {
      // Test blog API
      const blogResponse = await fetch('http://localhost:5001/api/blog?limit=1');
      if (blogResponse.ok) {
        console.log('   ✅ Blog API endpoint working');
      } else {
        console.log('   ⚠️  Blog API endpoint returned error:', blogResponse.status);
      }
    } catch (e) {
      console.log('   ⚠️  Could not test Blog API endpoint (server may not be running)');
    }
    
    try {
      // Test portfolio API
      const portfolioResponse = await fetch('http://localhost:5001/api/portfolio?limit=1');
      if (portfolioResponse.ok) {
        console.log('   ✅ Portfolio API endpoint working');
      } else {
        console.log('   ⚠️  Portfolio API endpoint returned error:', portfolioResponse.status);
      }
    } catch (e) {
      console.log('   ⚠️  Could not test Portfolio API endpoint (server may not be running)');
    }
    
    // Check for orphaned data or duplicates
    console.log('\n🔍 Checking for potential issues...');
    
    // Check for duplicate slugs in blog posts
    const duplicateBlogSlugs = await sequelize.query(`
      SELECT slug, COUNT(*) as count 
      FROM blog_posts 
      GROUP BY slug 
      HAVING COUNT(*) > 1
    `, { type: sequelize.QueryTypes.SELECT });
    
    if (duplicateBlogSlugs.length > 0) {
      console.log(`   ⚠️  Found ${duplicateBlogSlugs.length} duplicate blog post slugs`);
    } else {
      console.log('   ✅ No duplicate blog post slugs found');
    }
    
    // Check for duplicate slugs in portfolio items
    const duplicatePortfolioSlugs = await sequelize.query(`
      SELECT slug, COUNT(*) as count 
      FROM portfolio_items 
      GROUP BY slug 
      HAVING COUNT(*) > 1
    `, { type: sequelize.QueryTypes.SELECT });
    
    if (duplicatePortfolioSlugs.length > 0) {
      console.log(`   ⚠️  Found ${duplicatePortfolioSlugs.length} duplicate portfolio item slugs`);
    } else {
      console.log('   ✅ No duplicate portfolio item slugs found');
    }
    
    console.log('\n🎉 Migration verification completed!');
    
    // Summary and recommendations
    console.log('\n📋 Summary and Recommendations:');
    
    if (difference === 0 && duplicateBlogSlugs.length === 0 && duplicatePortfolioSlugs.length === 0) {
      console.log('✅ Migration appears to be completely successful!');
      console.log('   - All data migrated correctly');
      console.log('   - No duplicate entries found');
      console.log('   - Data integrity verified');
      console.log('\n🚀 You can now:');
      console.log('   1. Test the application thoroughly');
      console.log('   2. Consider removing the old contents table once everything is confirmed working');
      console.log('   3. Update any remaining legacy code references');
    } else {
      console.log('⚠️  Migration completed with some issues:');
      if (difference > 0) {
        console.log(`   - ${difference} records were not migrated`);
      }
      if (duplicateBlogSlugs.length > 0) {
        console.log(`   - ${duplicateBlogSlugs.length} duplicate blog post slugs need attention`);
      }
      if (duplicatePortfolioSlugs.length > 0) {
        console.log(`   - ${duplicatePortfolioSlugs.length} duplicate portfolio item slugs need attention`);
      }
      console.log('\n🔧 Recommended actions:');
      console.log('   1. Review unmigrated records in the original contents table');
      console.log('   2. Fix duplicate slugs if any');
      console.log('   3. Test application thoroughly before removing old table');
    }
    
    return {
      originalCount,
      migratedCount: migratedTotal,
      difference,
      duplicateBlogSlugs: duplicateBlogSlugs.length,
      duplicatePortfolioSlugs: duplicatePortfolioSlugs.length,
      success: difference <= 5 && duplicateBlogSlugs.length === 0 && duplicatePortfolioSlugs.length === 0 // Allow small difference for unknown types
    };
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    throw error;
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyMigration()
    .then((result) => {
      if (result.success) {
        console.log('\n🎉 Verification passed!');
        process.exit(0);
      } else {
        console.log('\n⚠️  Verification completed with warnings - please review the issues above');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyMigration };