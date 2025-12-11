const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create upload directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Image compression function
const compressImage = async (inputPath, outputPath, options = {}) => {
  try {
    const {
      width = 1200,
      height = 900,
      quality = 80,
      format = 'webp'
    } = options;

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality })
      .toFile(outputPath);

    // Replace original file with compressed version
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    
    return true;
  } catch (error) {
    console.error('Image compression error:', error);
    return false;
  }
};

// Copy file to build directory in production
const copyToProduction = (sourcePath, filename, uploadType) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      const buildPath = path.join(__dirname, `../../client/build/images/uploads/${uploadType}`);
      ensureDirectoryExists(buildPath);
      const buildFilePath = path.join(buildPath, filename);
      fs.copyFileSync(sourcePath, buildFilePath);
    } catch (error) {
      console.error('Error copying file to build directory:', error);
    }
  }
};

// Storage configuration for portfolio images
const portfolioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../client/public/images/uploads/portfolio');
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_originalname.webp (for compression)
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '');
    cb(null, `${timestamp}_${sanitizedName}.webp`);
  }
});

// Storage configuration for blog images
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../client/public/images/uploads/blog');
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_originalname.webp (for compression)
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '');
    cb(null, `${timestamp}_${sanitizedName}.webp`);
  }
});

// Storage configuration for team images
const teamStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../client/public/images/uploads/team');
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_originalname.webp (for compression)
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '');
    cb(null, `${timestamp}_${sanitizedName}.webp`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept only image files
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Multer configurations
const portfolioUpload = multer({
  storage: portfolioStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const blogUpload = multer({
  storage: blogStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const teamUpload = multer({
  storage: teamStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

module.exports = {
  portfolioUpload,
  blogUpload,
  teamUpload,
  compressImage
};