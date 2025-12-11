'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to the existing reviews table
    await queryInterface.addColumn('reviews', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    });

    await queryInterface.addColumn('reviews', 'company', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('reviews', 'position', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('reviews', 'service_type', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('reviews', 'project_type', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('reviews', 'is_featured', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('reviews', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('reviews', 'display_order', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('reviews', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('reviews', 'approved_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Rename message column to review_text
    await queryInterface.renameColumn('reviews', 'message', 'review_text');

    // Rename timestamp columns to match snake_case convention
    await queryInterface.renameColumn('reviews', 'createdAt', 'created_at');
    await queryInterface.renameColumn('reviews', 'updatedAt', 'updated_at');

    // Add indexes for better performance
    await queryInterface.addIndex('reviews', ['status']);
    await queryInterface.addIndex('reviews', ['is_featured']);
    await queryInterface.addIndex('reviews', ['user_id']);
    await queryInterface.addIndex('reviews', ['approved_by']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('reviews', ['status']);
    await queryInterface.removeIndex('reviews', ['is_featured']);
    await queryInterface.removeIndex('reviews', ['user_id']);
    await queryInterface.removeIndex('reviews', ['approved_by']);

    // Rename columns back
    await queryInterface.renameColumn('reviews', 'review_text', 'message');
    await queryInterface.renameColumn('reviews', 'created_at', 'createdAt');
    await queryInterface.renameColumn('reviews', 'updated_at', 'updatedAt');

    // Remove added columns
    await queryInterface.removeColumn('reviews', 'email');
    await queryInterface.removeColumn('reviews', 'company');
    await queryInterface.removeColumn('reviews', 'position');
    await queryInterface.removeColumn('reviews', 'service_type');
    await queryInterface.removeColumn('reviews', 'project_type');
    await queryInterface.removeColumn('reviews', 'is_featured');
    await queryInterface.removeColumn('reviews', 'user_id');
    await queryInterface.removeColumn('reviews', 'display_order');
    await queryInterface.removeColumn('reviews', 'approved_at');
    await queryInterface.removeColumn('reviews', 'approved_by');
  }
};