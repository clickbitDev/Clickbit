const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { portfolioUpload, blogUpload, teamUpload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

// Copy file to build directory in production
const copyToProduction = (sourcePath, filename, uploadType) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      const buildPath = path.join(__dirname, `../../client/build/images/uploads/${uploadType}`);
      if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath, { recursive: true });
      }
      const buildFilePath = path.join(buildPath, filename);
      fs.copyFileSync(sourcePath, buildFilePath);
    } catch (error) {
      console.error('Error copying file to build directory:', error);
    }
  }
};

// @desc    Upload portfolio image
// @route   POST /api/upload/portfolio
// @access  Private/Admin
router.post('/portfolio', 
  protect, 
  authorize('admin', 'manager'),
  portfolioUpload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Copy to production build directory if needed
      copyToProduction(req.file.path, req.file.filename, 'portfolio');
      
      // Return the URL path that can be used in the frontend
      const imageUrl = `/images/uploads/portfolio/${req.file.filename}`;
      
      res.status(200).json({
        message: 'Portfolio image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Portfolio upload error:', error);
      res.status(500).json({ message: 'Error uploading portfolio image', error: error.message });
    }
  }
);

// @desc    Upload blog image
// @route   POST /api/upload/blog
// @access  Private/Admin
router.post('/blog',
  protect,
  authorize('admin', 'manager'),
  blogUpload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Copy to production build directory if needed
      copyToProduction(req.file.path, req.file.filename, 'blog');
      
      // Return the URL path that can be used in the frontend
      const imageUrl = `/images/uploads/blog/${req.file.filename}`;
      
      res.status(200).json({
        message: 'Blog image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Blog upload error:', error);
      res.status(500).json({ message: 'Error uploading blog image', error: error.message });
    }
  }
);

// @desc    Upload team image
// @route   POST /api/upload/team
// @access  Private/Admin
router.post('/team',
  protect,
  authorize('admin', 'manager'),
  teamUpload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Copy to production build directory if needed
      copyToProduction(req.file.path, req.file.filename, 'team');
      
      // Return the URL path that can be used in the frontend
      const imageUrl = `/images/uploads/team/${req.file.filename}`;
      
      res.status(200).json({
        message: 'Team image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Team upload error:', error);
      res.status(500).json({ message: 'Error uploading team image', error: error.message });
    }
  }
);

// @desc    Upload multiple portfolio images (for gallery)
// @route   POST /api/upload/portfolio/multiple
// @access  Private/Admin
router.post('/portfolio/multiple',
  protect,
  authorize('admin', 'manager'),
  portfolioUpload.array('images', 10), // Allow up to 10 images
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedImages = req.files.map(file => {
        // Copy to production build directory if needed
        copyToProduction(file.path, file.filename, 'portfolio');
        
        return {
          imageUrl: `/images/uploads/portfolio/${file.filename}`,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size
        };
      });
      
      res.status(200).json({
        message: `${req.files.length} portfolio images uploaded successfully`,
        images: uploadedImages
      });
    } catch (error) {
      console.error('Multiple portfolio upload error:', error);
      res.status(500).json({ message: 'Error uploading portfolio images', error: error.message });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field name. Use "image" for single upload or "images" for multiple.' });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ message: error.message });
  }
  
  res.status(500).json({ message: 'Upload error', error: error.message });
});

module.exports = router;