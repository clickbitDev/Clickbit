'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create blog_posts table
    await queryInterface.createTable('blog_posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 255]
        }
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      excerpt: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      featured_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'scheduled', 'archived', 'private'),
        defaultValue: 'draft',
        allowNull: false
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      meta_description: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      meta_keywords: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      categories: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      allow_comments: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      comment_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('blog_posts', ['status']);
    await queryInterface.addIndex('blog_posts', ['author_id']);
    await queryInterface.addIndex('blog_posts', ['published_at']);
    await queryInterface.addIndex('blog_posts', ['scheduled_at']);
    await queryInterface.addIndex('blog_posts', ['featured']);
    await queryInterface.addIndex('blog_posts', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable('blog_posts');
  }
};
