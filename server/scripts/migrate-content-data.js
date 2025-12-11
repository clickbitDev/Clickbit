const { sequelize } = require('../config/database');
const { Content, BlogPost, PortfolioItem, Page, SiteSetting } = require('../models');

/**
 * Migration script to move data from the contents table to dedicated tables
 */
async function migrateContentData() {
  console.log('🚀 Starting content data migration...');
  
  try {
    // Ensure all models are synced
    console.log('📊 Syncing database models...');
    await sequelize.sync();
    
    // Get all content from the contents table
    console.log('📋 Fetching existing content data...');
    const allContent = await Content.findAll({
      order: [['created_at', 'ASC']]
    });
    
    console.log(`📈 Found ${allContent.length} content items to migrate`);
    
    let blogPostsMigrated = 0;
    let portfolioItemsMigrated = 0;
    let pagesMigrated = 0;
    let settingsMigrated = 0;
    let skipped = 0;
    
    for (const contentItem of allContent) {
      try {
        const contentType = contentItem.content_type || 'page';
        
        switch (contentType) {
          case 'post':
          case 'article':
          case 'news':
            await migrateBlogPost(contentItem);
            blogPostsMigrated++;
            break;
            
          case 'custom':
          case 'portfolio':
          case 'project':
            await migratePortfolioItem(contentItem);
            portfolioItemsMigrated++;
            break;
            
          case 'page':
            await migratePage(contentItem);
            pagesMigrated++;
            break;
            
          default:
            // Check if it's settings data based on slug or other criteria
            if (isSettingsContent(contentItem)) {
              await migrateSetting(contentItem);
              settingsMigrated++;
            } else {
              console.log(`⚠️  Skipping unknown content type: ${contentType} (ID: ${contentItem.id})`);
              skipped++;
            }
            break;
        }
        
      } catch (error) {
        console.error(`❌ Error migrating content item ${contentItem.id}:`, error.message);
        skipped++;
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Migration Summary:`);
    console.log(`   - Blog Posts: ${blogPostsMigrated}`);
    console.log(`   - Portfolio Items: ${portfolioItemsMigrated}`);
    console.log(`   - Pages: ${pagesMigrated}`);
    console.log(`   - Settings: ${settingsMigrated}`);
    console.log(`   - Skipped: ${skipped}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Migrate blog post content
 */
async function migrateBlogPost(contentItem) {
  console.log(`📝 Migrating blog post: ${contentItem.title}`);
  
  // Parse custom fields to extract categories and tags
  let customFields = {};
  try {
    customFields = typeof contentItem.custom_fields === 'string' 
      ? JSON.parse(contentItem.custom_fields) 
      : (contentItem.custom_fields || {});
  } catch (e) {
    customFields = {};
  }
  
  // Check if blog post already exists
  const existingPost = await BlogPost.findOne({
    where: { slug: contentItem.slug }
  });
  
  if (existingPost) {
    console.log(`⚠️  Blog post with slug '${contentItem.slug}' already exists, skipping...`);
    return;
  }
  
  await BlogPost.create({
    title: contentItem.title,
    slug: contentItem.slug,
    content: contentItem.content,
    excerpt: contentItem.excerpt,
    status: contentItem.status || 'published',
    featured_image: contentItem.featured_image,
    author_id: contentItem.author_id || 1,
    categories: customFields.category ? [customFields.category] : ['General'],
    tags: customFields.tags || contentItem.tags || [],
    seo_title: customFields.seo_title || contentItem.title,
    seo_description: customFields.seo_description || contentItem.excerpt,
    published_at: contentItem.published_at || contentItem.created_at,
    created_at: contentItem.created_at,
    updated_at: contentItem.updated_at
  });
}

/**
 * Migrate portfolio item content
 */
async function migratePortfolioItem(contentItem) {
  console.log(`🎨 Migrating portfolio item: ${contentItem.title}`);
  
  // Parse custom fields to extract portfolio-specific data
  let customFields = {};
  try {
    customFields = typeof contentItem.custom_fields === 'string' 
      ? JSON.parse(contentItem.custom_fields) 
      : (contentItem.custom_fields || {});
  } catch (e) {
    customFields = {};
  }
  
  // Check if portfolio item already exists
  const existingItem = await PortfolioItem.findOne({
    where: { slug: contentItem.slug }
  });
  
  if (existingItem) {
    console.log(`⚠️  Portfolio item with slug '${contentItem.slug}' already exists, skipping...`);
    return;
  }
  
  await PortfolioItem.create({
    title: contentItem.title,
    slug: contentItem.slug,
    description: contentItem.content,
    status: contentItem.status || 'published',
    featured_image: contentItem.featured_image,
    category: customFields.category || 'Web Development',
    client_name: customFields.client || customFields.client_name,
    technologies: customFields.technologies || contentItem.tags || [],
    live_url: customFields.project_url || customFields.live_url || customFields.externalUrl,
    github_url: customFields.github_url,
    gallery_images: customFields.images || (contentItem.featured_image ? [contentItem.featured_image] : []),
    project_date: customFields.completed_at || contentItem.published_at || contentItem.created_at,
    sort_order: customFields.sort_order || 0,
    featured: customFields.featured || false,
    created_at: contentItem.created_at,
    updated_at: contentItem.updated_at
  });
}

/**
 * Migrate page content
 */
async function migratePage(contentItem) {
  console.log(`📄 Migrating page: ${contentItem.title}`);
  
  // Check if page already exists
  const existingPage = await Page.findOne({
    where: { slug: contentItem.slug }
  });
  
  if (existingPage) {
    console.log(`⚠️  Page with slug '${contentItem.slug}' already exists, skipping...`);
    return;
  }
  
  await Page.create({
    title: contentItem.title,
    slug: contentItem.slug,
    content: contentItem.content,
    status: contentItem.status || 'published',
    author_id: contentItem.author_id || 1,
    template: 'default',
    featured_image: contentItem.featured_image,
    seo_title: contentItem.title,
    seo_description: contentItem.excerpt,
    published_at: contentItem.published_at || contentItem.created_at,
    created_at: contentItem.created_at,
    updated_at: contentItem.updated_at
  });
}

/**
 * Migrate settings content
 */
async function migrateSetting(contentItem) {
  console.log(`⚙️  Migrating setting: ${contentItem.title}`);
  
  // Determine setting key from slug or title
  const settingKey = contentItem.slug || contentItem.title.toLowerCase().replace(/\s+/g, '_');
  
  // Check if setting already exists
  const existingSetting = await SiteSetting.findOne({
    where: { setting_key: settingKey }
  });
  
  if (existingSetting) {
    console.log(`⚠️  Setting with key '${settingKey}' already exists, skipping...`);
    return;
  }
  
  // Determine setting type and value
  let settingType = 'content';
  let settingValue = contentItem.content;
  
  // Try to parse as JSON if it looks like structured data
  try {
    if (contentItem.custom_fields) {
      settingValue = JSON.stringify(contentItem.custom_fields);
      settingType = 'system';
    } else if (contentItem.content && (contentItem.content.startsWith('{') || contentItem.content.startsWith('['))) {
      JSON.parse(contentItem.content); // Test if it's valid JSON
      settingType = 'system';
    }
  } catch (e) {
    // Not JSON, keep as content
  }
  
  await SiteSetting.create({
    setting_key: settingKey,
    setting_value: settingValue,
    setting_type: settingType,
    description: contentItem.excerpt || `Migrated setting: ${contentItem.title}`,
    is_public: contentItem.status === 'published',
    auto_load: false,
    created_at: contentItem.created_at,
    updated_at: contentItem.updated_at
  });
}

/**
 * Check if content item should be treated as settings
 */
function isSettingsContent(contentItem) {
  const settingsIndicators = [
    'config', 'setting', 'option', 'preference', 'meta',
    'site-identity', 'contact-info', 'footer-content',
    'navigation', 'marketing', 'billing', 'faq',
    'mission', 'process'
  ];
  
  const slug = (contentItem.slug || '').toLowerCase();
  const title = (contentItem.title || '').toLowerCase();
  
  return settingsIndicators.some(indicator => 
    slug.includes(indicator) || title.includes(indicator)
  );
}

// Run migration if called directly
if (require.main === module) {
  migrateContentData()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateContentData };