# Content Table Migration Scripts

This directory contains scripts to migrate data from the old `contents` table to the new dedicated tables (`blog_posts`, `portfolio_items`, `pages`, `site_settings`).

## Overview

The migration process separates the mixed `contents` table into specific tables:
- **Blog Posts** → `blog_posts` table (BlogPost model)
- **Portfolio Items** → `portfolio_items` table (PortfolioItem model)  
- **Static Pages** → `pages` table (Page model)
- **Site Settings** → `site_settings` table (SiteSetting model)

## Scripts

### 1. `backup-content-table.js`
Creates a backup of the original `contents` table before migration.

```bash
# Create backup
node backup-content-table.js

# Restore from backup (if needed)
node backup-content-table.js restore path/to/backup-file.json
```

### 2. `migrate-content-data.js`
Migrates data from `contents` table to new dedicated tables.

```bash
# Run migration only
node migrate-content-data.js
```

### 3. `run-content-migration.js`
Complete migration process (backup + migration).

```bash
# Run complete process (backup then migrate)
node run-content-migration.js

# Run only backup
node run-content-migration.js --backup-only

# Run only migration (skip backup)
node run-content-migration.js --skip-backup
```

### 4. `verify-migration.js`
Verifies that the migration was successful.

```bash
# Verify migration results
node verify-migration.js
```

## Migration Process

### Step 1: Preparation
1. **Backup your database** using your database tools
2. Ensure the new table models are synced:
   ```bash
   # In your main application
   npm run db:sync
   ```
3. Ensure the server is running for API endpoint testing

### Step 2: Run Migration
```bash
# Recommended: Run complete process with backup
cd server/scripts
node run-content-migration.js
```

### Step 3: Verification
```bash
# Verify the migration was successful
node verify-migration.js
```

### Step 4: Testing
1. Test your application thoroughly
2. Check admin panel functionality
3. Test public blog and portfolio pages
4. Verify all API endpoints work correctly

### Step 5: Cleanup (Optional)
Once everything is confirmed working:
1. You can optionally remove or rename the old `contents` table
2. Update any remaining legacy code references

## Migration Logic

### Content Type Mapping
- `content_type: 'post'` → BlogPost
- `content_type: 'article'` → BlogPost  
- `content_type: 'news'` → BlogPost
- `content_type: 'custom'` → PortfolioItem
- `content_type: 'portfolio'` → PortfolioItem
- `content_type: 'project'` → PortfolioItem
- `content_type: 'page'` → Page
- Settings-related content → SiteSetting

### Field Mapping

#### Blog Posts
- `title` → `title`
- `slug` → `slug`
- `content` → `content`
- `excerpt` → `excerpt`
- `featured_image` → `featured_image`
- `custom_fields.category` → `categories` (array)
- `custom_fields.tags` or `tags` → `tags`

#### Portfolio Items
- `title` → `title`
- `slug` → `slug`
- `content` → `description`
- `featured_image` → `featured_image`
- `custom_fields.category` → `category`
- `custom_fields.technologies` or `tags` → `technologies`
- `custom_fields.client` → `client_name`
- `custom_fields.project_url` → `live_url`
- `custom_fields.github_url` → `github_url`

#### Pages
- `title` → `title`
- `slug` → `slug`
- `content` → `content`
- `featured_image` → `featured_image`

#### Settings
- `slug` or derived from `title` → `setting_key`
- `content` or `custom_fields` → `setting_value`
- Auto-detected → `setting_type`

## Backup Files

Backup files are saved in `server/backups/` with timestamp:
- Format: `content-backup-YYYY-MM-DDTHH-MM-SS-sssZ.json`
- Contains metadata and all original records
- Can be used to restore if needed

## Error Handling

- **Duplicate slugs**: Migration skips existing records with same slug
- **Invalid data**: Records with errors are logged but don't stop migration
- **Missing fields**: Default values are used where possible
- **Unknown content types**: Logged and skipped

## Verification Checks

The verification script checks:
- Record counts in all tables
- Data accessibility and integrity
- API endpoint functionality
- Duplicate slug detection
- Migration completeness

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure database is running
   - Check connection credentials in `.env`

2. **Missing tables**
   - Run `npm run db:sync` to create new tables
   - Check model definitions

3. **Permission errors**
   - Ensure database user has CREATE/INSERT permissions
   - Check file system permissions for backup directory

4. **Duplicate slug errors**
   - Review content with duplicate slugs
   - Manually fix or remove duplicates before migration

### Recovery

If something goes wrong:
1. Stop the application
2. Restore from database backup
3. Or restore contents table from JSON backup:
   ```bash
   node backup-content-table.js restore path/to/backup-file.json
   ```
4. Fix the issue and retry migration

## Post-Migration

After successful migration:
1. Update frontend applications to use new API endpoints
2. Test all functionality thoroughly
3. Monitor application for any issues
4. Consider removing old contents table once stable
5. Update documentation and code comments

## Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Review the backup files to understand data structure
3. Verify database schema and model definitions
4. Test with a small subset of data first if needed