const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image compression function
const compressImage = async (inputPath, outputPath, options = {}) => {
  try {
    const {
      width = 1200,
      height = 900,
      quality = 80
    } = options;

    const info = await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality })
      .toFile(outputPath);

    return {
      success: true,
      originalSize: fs.statSync(inputPath).size,
      compressedSize: info.size,
      compressionRatio: Math.round((1 - info.size / fs.statSync(inputPath).size) * 100)
    };
  } catch (error) {
    console.error('Image compression error:', error);
    return { success: false, error: error.message };
  }
};

// Function to compress all images in a directory
const compressDirectory = async (dirPath, options = {}) => {
  try {
    const files = fs.readdirSync(dirPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file) && !file.endsWith('.webp')
    );

    console.log(`Found ${imageFiles.length} images to compress in ${dirPath}`);
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    let successCount = 0;

    for (const file of imageFiles) {
      const inputPath = path.join(dirPath, file);
      const outputPath = path.join(dirPath, file.replace(/\.[^/.]+$/, '.webp'));
      
      console.log(`Compressing: ${file}`);
      
      const result = await compressImage(inputPath, outputPath, options);
      
      if (result.success) {
        totalOriginalSize += result.originalSize;
        totalCompressedSize += result.compressedSize;
        successCount++;
        
        console.log(`✅ ${file} -> ${path.basename(outputPath)}`);
        console.log(`   Size: ${Math.round(result.originalSize/1024)}KB -> ${Math.round(result.compressedSize/1024)}KB (${result.compressionRatio}% reduction)`);
        
        // Remove original file after successful compression
        fs.unlinkSync(inputPath);
      } else {
        console.log(`❌ Failed to compress ${file}: ${result.error}`);
      }
    }

    const totalReduction = Math.round((1 - totalCompressedSize / totalOriginalSize) * 100);
    console.log(`\n📊 Summary for ${dirPath}:`);
    console.log(`   Successfully compressed: ${successCount}/${imageFiles.length} images`);
    console.log(`   Total size reduction: ${Math.round(totalOriginalSize/1024)}KB -> ${Math.round(totalCompressedSize/1024)}KB (${totalReduction}% reduction)`);
    
    return {
      processed: imageFiles.length,
      successful: successCount,
      totalOriginalSize,
      totalCompressedSize,
      totalReduction
    };
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
    return { error: error.message };
  }
};

// Main compression function
const compressExistingImages = async () => {
  console.log('🖼️  Starting compression of existing images...\n');
  
  const directories = [
    {
      path: path.join(__dirname, 'client/public/images/uploads/portfolio'),
      options: { width: 800, height: 600, quality: 85 }
    },
    {
      path: path.join(__dirname, 'client/public/images/uploads/blog'),
      options: { width: 1000, height: 750, quality: 80 }
    },
    {
      path: path.join(__dirname, 'client/public/images/uploads/team'),
      options: { width: 400, height: 400, quality: 85 }
    }
  ];

  let grandTotalOriginal = 0;
  let grandTotalCompressed = 0;
  let grandTotalProcessed = 0;

  for (const dir of directories) {
    if (fs.existsSync(dir.path)) {
      console.log(`\n📁 Processing: ${dir.path}`);
      const result = await compressDirectory(dir.path, dir.options);
      
      if (!result.error) {
        grandTotalOriginal += result.totalOriginalSize;
        grandTotalCompressed += result.totalCompressedSize;
        grandTotalProcessed += result.processed;
      }
    } else {
      console.log(`⚠️  Directory not found: ${dir.path}`);
    }
  }

  const grandTotalReduction = grandTotalOriginal > 0 ? 
    Math.round((1 - grandTotalCompressed / grandTotalOriginal) * 100) : 0;

  console.log(`\n🎉 COMPRESSION COMPLETE!`);
  console.log(`📊 Grand Total:`);
  console.log(`   Images processed: ${grandTotalProcessed}`);
  console.log(`   Total size reduction: ${Math.round(grandTotalOriginal/1024)}KB -> ${Math.round(grandTotalCompressed/1024)}KB`);
  console.log(`   Overall compression: ${grandTotalReduction}% reduction`);
  console.log(`   Estimated PageSpeed improvement: ${Math.round(grandTotalOriginal/1024)}KB saved`);
};

// Run the compression
if (require.main === module) {
  compressExistingImages()
    .then(() => {
      console.log('\n✅ Image compression completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Image compression failed:', error);
      process.exit(1);
    });
}

module.exports = { compressExistingImages, compressImage };
