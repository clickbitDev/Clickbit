'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add scheduled_at column
    await queryInterface.addColumn('blog_posts', 'scheduled_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'published_at'
    });

    // Update status enum to include 'scheduled'
    await queryInterface.changeColumn('blog_posts', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'scheduled', 'archived', 'private'),
      defaultValue: 'draft',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove scheduled_at column
    await queryInterface.removeColumn('blog_posts', 'scheduled_at');

    // Revert status enum to original values
    await queryInterface.changeColumn('blog_posts', 'status', {
      type: Sequelize.ENUM('draft', 'published', 'archived', 'private'),
      defaultValue: 'draft',
      allowNull: false
    });
  }
}; 