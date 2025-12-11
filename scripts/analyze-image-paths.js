const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { sequelize } = require('../server/config/database');
const { PortfolioItem, BlogPost } = require('../server/models');

async function analyzeImages() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Analyze Portfolio Images
    console.log('='.repeat(80));
    console.log('PORTFOLIO IMAGES ANALYSIS');
    console.log('='.repeat(80));
    
    const portfolioItems = await PortfolioItem.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug', 'featured_image', 'gallery_images']
    });

    console.log(`\nFound ${portfolioItems.length} published portfolio items\n`);

    const portfolioUploadPath = path.join(__dirname, '../client/public/images/uploads/portfolio');
    const portfolioFiles = fs.existsSync(portfolioUploadPath) 
      ? fs.readdirSync(portfolioUploadPath).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'))
      : [];

    console.log(`Portfolio upload directory: ${portfolioUploadPath}`);
    console.log(`Files in directory: ${portfolioFiles.length}\n`);

    let portfolioIssues = [];
    portfolioItems.forEach(item => {
      const issues = [];
      
      // Check featured_image
      if (item.featured_image) {
        const imagePath = item.featured_image;
        const filename = imagePath.split('/').pop();
        const fileExists = portfolioFiles.some(f => f === filename || f.startsWith(filename.split('.')[0]));
        
        if (!fileExists) {
          issues.push(`Featured image not found: ${imagePath} (looking for: ${filename})`);
        } else {
          console.log(`✅ ${item.title}: Featured image OK - ${imagePath}`);
        }
      } else {
        issues.push('No featured_image set');
        console.log(`⚠️  ${item.title}: No featured_image`);
      }

      // Check gallery_images
      if (item.gallery_images && Array.isArray(item.gallery_images) && item.gallery_images.length > 0) {
        item.gallery_images.forEach((galleryImg, idx) => {
          if (galleryImg) {
            const filename = galleryImg.split('/').pop();
            const fileExists = portfolioFiles.some(f => f === filename || f.startsWith(filename.split('.')[0]));
            
            if (!fileExists) {
              issues.push(`Gallery image ${idx + 1} not found: ${galleryImg}`);
            }
          }
        });
      }

      if (issues.length > 0) {
        portfolioIssues.push({
          id: item.id,
          title: item.title,
          slug: item.slug,
          issues
        });
      }
    });

    if (portfolioIssues.length > 0) {
      console.log('\n❌ PORTFOLIO IMAGE ISSUES:');
      portfolioIssues.forEach(item => {
        console.log(`\n  Item: ${item.title} (ID: ${item.id}, Slug: ${item.slug})`);
        item.issues.forEach(issue => console.log(`    - ${issue}`));
      });
    } else {
      console.log('\n✅ All portfolio images are valid!');
    }

    // Analyze Blog Images
    console.log('\n\n' + '='.repeat(80));
    console.log('BLOG IMAGES ANALYSIS');
    console.log('='.repeat(80));
    
    const blogPosts = await BlogPost.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug', 'featured_image']
    });

    console.log(`\nFound ${blogPosts.length} published blog posts\n`);

    const blogUploadPath = path.join(__dirname, '../client/public/images/uploads/blog');
    const blogFiles = fs.existsSync(blogUploadPath) 
      ? fs.readdirSync(blogUploadPath).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'))
      : [];

    console.log(`Blog upload directory: ${blogUploadPath}`);
    console.log(`Files in directory: ${blogFiles.length}\n`);

    let blogIssues = [];
    blogPosts.forEach(post => {
      const issues = [];
      
      // Check featured_image
      if (post.featured_image) {
        const imagePath = post.featured_image;
        const filename = imagePath.split('/').pop();
        const fileExists = blogFiles.some(f => f === filename || f.startsWith(filename.split('.')[0]));
        
        if (!fileExists) {
          issues.push(`Featured image not found: ${imagePath} (looking for: ${filename})`);
        } else {
          console.log(`✅ ${post.title}: Featured image OK - ${imagePath}`);
        }
      } else {
        issues.push('No featured_image set');
        console.log(`⚠️  ${post.title}: No featured_image`);
      }

      if (issues.length > 0) {
        blogIssues.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          issues
        });
      }
    });

    if (blogIssues.length > 0) {
      console.log('\n❌ BLOG IMAGE ISSUES:');
      blogIssues.forEach(post => {
        console.log(`\n  Post: ${post.title} (ID: ${post.id}, Slug: ${post.slug})`);
        post.issues.forEach(issue => console.log(`    - ${issue}`));
      });
    } else {
      console.log('\n✅ All blog images are valid!');
    }

    // Summary
    console.log('\n\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`\nPortfolio Items: ${portfolioItems.length} total`);
    console.log(`  - With issues: ${portfolioIssues.length}`);
    console.log(`  - OK: ${portfolioItems.length - portfolioIssues.length}`);
    console.log(`\nBlog Posts: ${blogPosts.length} total`);
    console.log(`  - With issues: ${blogIssues.length}`);
    console.log(`  - OK: ${blogPosts.length - blogIssues.length}`);
    console.log(`\nPortfolio Files: ${portfolioFiles.length} in directory`);
    console.log(`Blog Files: ${blogFiles.length} in directory`);

    // Check path patterns
    console.log('\n\n' + '='.repeat(80));
    console.log('PATH PATTERN ANALYSIS');
    console.log('='.repeat(80));
    
    const portfolioPaths = portfolioItems
      .map(item => item.featured_image)
      .filter(Boolean)
      .map(p => {
        if (p.startsWith('/images/uploads/portfolio/')) return 'CORRECT';
        if (p.startsWith('http')) return 'EXTERNAL_URL';
        if (p.startsWith('/images/')) return 'OTHER_IMAGE_PATH';
        return 'UNKNOWN';
      });
    
    const blogPaths = blogPosts
      .map(post => post.featured_image)
      .filter(Boolean)
      .map(p => {
        if (p.startsWith('/images/uploads/blog/')) return 'CORRECT';
        if (p.startsWith('http')) return 'EXTERNAL_URL';
        if (p.startsWith('/images/')) return 'OTHER_IMAGE_PATH';
        return 'UNKNOWN';
      });

    console.log('\nPortfolio Image Path Patterns:');
    const portfolioPathCounts = portfolioPaths.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    Object.entries(portfolioPathCounts).forEach(([pattern, count]) => {
      console.log(`  ${pattern}: ${count}`);
    });

    console.log('\nBlog Image Path Patterns:');
    const blogPathCounts = blogPaths.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    Object.entries(blogPathCounts).forEach(([pattern, count]) => {
      console.log(`  ${pattern}: ${count}`);
    });

    await sequelize.close();
    console.log('\n✅ Analysis complete!');
    
  } catch (error) {
    console.error('Error analyzing images:', error);
    process.exit(1);
  }
}

analyzeImages();

