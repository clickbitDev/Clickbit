const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { User } = require('../models');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin/Manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    let whereClause = {};
    
    // Managers can only see customers, admins can see all users
    if (req.user.role === 'manager') {
      whereClause = { role: 'customer' };
    }
    
    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin/Manager
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, email_verified } = req.body;
    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Managers can only create customers
    if (req.user.role === 'manager' && role !== 'customer') {
      return res.status(403).json({ message: 'Managers can only create customer accounts.' });
    }

    // Auto-verify users created by admins (unless explicitly set to false)
    // Only admins can set email_verified, managers cannot
    const shouldVerify = req.user.role === 'admin' 
      ? (email_verified !== undefined ? email_verified : true)
      : false;

    const newUser = await User.create({ 
      first_name, 
      last_name, 
      email, 
      password, 
      role,
      email_verified: shouldVerify
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
router.get('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { first_name, last_name, email, role, status, password, email_verified } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Managers can only update customers
    if (req.user.role === 'manager' && user.role !== 'customer') {
      return res.status(403).json({ message: 'Managers can only update customer accounts.' });
    }

    // Managers cannot change user roles to admin or manager
    if (req.user.role === 'manager' && role && role !== 'customer') {
      return res.status(403).json({ message: 'Managers can only assign customer roles.' });
    }

    // Update fields only if they are provided (not undefined)
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;

    // Only admins can update email_verified status
    if (req.user.role === 'admin' && email_verified !== undefined) {
      user.email_verified = email_verified;
    }

    // If a new password is provided, it will be hashed by the beforeUpdate hook
    if (password) {
      user.password = password;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin/Manager
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Managers can only delete customers
    if (req.user.role === 'manager' && user.role !== 'customer') {
      return res.status(403).json({ message: 'Managers can only delete customer accounts.' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 