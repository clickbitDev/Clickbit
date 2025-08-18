const express = require('express');
const router = express.Router();
const { Team } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all active team members
// @route   GET /api/team
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await Team.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['id', 'ASC']]
    });
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
});

// @desc    Get a single team member
// @route   GET /api/team/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await Team.findByPk(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ message: 'Error fetching team member' });
  }
});

// @desc    Create a new team member
// @route   POST /api/team
// @access  Private/Admin/Manager
router.post('/', protect, authorize('team:create'), async (req, res) => {
  try {
    const teamMember = await Team.create(req.body);
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(400).json({ message: 'Error creating team member', error: error.message });
  }
});

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin/Manager
router.put('/:id', protect, authorize('team:update'), async (req, res) => {
  try {
    const teamMember = await Team.findByPk(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    await teamMember.update(req.body);
    res.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(400).json({ message: 'Error updating team member', error: error.message });
  }
});

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin/Manager
router.delete('/:id', protect, authorize('team:delete'), async (req, res) => {
  try {
    const teamMember = await Team.findByPk(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    await teamMember.destroy();
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Error deleting team member' });
  }
});

module.exports = router;