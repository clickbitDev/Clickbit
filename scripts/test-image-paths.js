const path = require('path');
const fs = require('fs');

// Test image paths locally
console.log('='.repeat(80));
console.log('IMAGE PATH VERIFICATION');
console.log('='.repeat(80));

// Check portfolio images
const portfolioPublicPath = path.join(__dirname, '../client/public/images/uploads/portfolio');
const portfolioBuildPath = path.join(__dirname, '../client/build/images/uploads/portfolio');

console.log('\n📁 PORTFOLIO IMAGES:');
console.log(`Public path: ${portfolioPublicPath}`);
console.log(`Build path: ${portfolioBuildPath}`);

if (fs.existsSync(portfolioPublicPath)) {
  const publicFiles = fs.readdirSync(portfolioPublicPath).filter(f => 
    f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );
  console.log(`✅ Public directory exists with ${publicFiles.length} image files`);
  if (publicFiles.length > 0) {
    console.log(`   Sample files: ${publicFiles.slice(0, 3).join(', ')}`);
    console.log(`   Expected URL: /images/uploads/portfolio/${publicFiles[0]}`);
  }
} else {
  console.log(`❌ Public directory does not exist`);
}

if (fs.existsSync(portfolioBuildPath)) {
  const buildFiles = fs.readdirSync(portfolioBuildPath).filter(f => 
    f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );
  console.log(`✅ Build directory exists with ${buildFiles.length} image files`);
  if (buildFiles.length > 0) {
    console.log(`   Sample files: ${buildFiles.slice(0, 3).join(', ')}`);
  }
} else {
  console.log(`⚠️  Build directory does not exist (OK for development)`);
}

// Check blog images
const blogPublicPath = path.join(__dirname, '../client/public/images/uploads/blog');
const blogBuildPath = path.join(__dirname, '../client/build/images/uploads/blog');

console.log('\n📁 BLOG IMAGES:');
console.log(`Public path: ${blogPublicPath}`);
console.log(`Build path: ${blogBuildPath}`);

if (fs.existsSync(blogPublicPath)) {
  const publicFiles = fs.readdirSync(blogPublicPath).filter(f => 
    f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );
  console.log(`✅ Public directory exists with ${publicFiles.length} image files`);
  if (publicFiles.length > 0) {
    console.log(`   Sample files: ${publicFiles.slice(0, 3).join(', ')}`);
    console.log(`   Expected URL: /images/uploads/blog/${publicFiles[0]}`);
  }
} else {
  console.log(`❌ Public directory does not exist`);
}

if (fs.existsSync(blogBuildPath)) {
  const buildFiles = fs.readdirSync(blogBuildPath).filter(f => 
    f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );
  console.log(`✅ Build directory exists with ${buildFiles.length} image files`);
  if (buildFiles.length > 0) {
    console.log(`   Sample files: ${buildFiles.slice(0, 3).join(', ')}`);
  }
} else {
  console.log(`⚠️  Build directory does not exist (OK for development)`);
}

// Check server configuration
console.log('\n⚙️  SERVER CONFIGURATION:');
const serverIndexPath = path.join(__dirname, '../server/index.js');
if (fs.existsSync(serverIndexPath)) {
  const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
  
  // Check if images are served correctly
  if (serverContent.includes("app.use('/images'")) {
    console.log('✅ Server has /images route configured');
  } else {
    console.log('❌ Server missing /images route');
  }
  
  // Check production vs development paths
  if (serverContent.includes('client/build/images')) {
    console.log('✅ Server configured to serve from build directory in production');
  }
  if (serverContent.includes('client/public/images')) {
    console.log('✅ Server configured to serve from public directory in development');
  }
}

// Check placeholder images
console.log('\n🖼️  PLACEHOLDER IMAGES:');
const placeholderPath = path.join(__dirname, '../client/public/images/placeholders');
if (fs.existsSync(placeholderPath)) {
  const placeholders = fs.readdirSync(placeholderPath);
  console.log(`✅ Placeholder directory exists with ${placeholders.length} files`);
  console.log(`   Files: ${placeholders.join(', ')}`);
} else {
  console.log(`❌ Placeholder directory does not exist`);
}

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log('\nTo test image serving:');
console.log('1. Start the server: npm start (in server directory)');
console.log('2. Test portfolio image: curl http://localhost:5001/images/uploads/portfolio/{filename}');
console.log('3. Test blog image: curl http://localhost:5001/images/uploads/blog/{filename}');
console.log('4. Check browser console for 404 errors on image requests');
console.log('\nCommon issues:');
console.log('- Images not in build directory (production)');
console.log('- Incorrect paths in database (missing /images prefix)');
console.log('- Server not serving static files correctly');
console.log('- CORS issues blocking image requests');

