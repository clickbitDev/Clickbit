'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add scheduled_at column
    await queryInterface.addColumn('BlogPosts', 'scheduled_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'published_at'
    });

    // Update status enum to include 'scheduled'
    await queryInterface.changeColumn('BlogPosts', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'scheduled', 'archived', 'private'),
      defaultValue: 'draft',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove scheduled_at column
    await queryInterface.removeColumn('BlogPosts', 'scheduled_at');

    // Revert status enum to original values
    await queryInterface.changeColumn('BlogPosts', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'archived', 'private'),
      defaultValue: 'draft',
      allowNull: false
    });
  }
}; 