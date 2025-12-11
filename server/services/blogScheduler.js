const cron = require('node-cron');
const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');

class BlogScheduler {
  constructor() {
    this.task = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Blog scheduler is already running');
      return;
    }

    // Run every minute to check for scheduled posts
    this.task = cron.schedule('* * * * *', async () => {
      await this.checkScheduledPosts();
    }, {
      scheduled: false
    });

    this.task.start();
    this.isRunning = true;
    console.log('Blog scheduler started - checking for scheduled posts every minute');
  }

  stop() {
    if (this.task) {
      this.task.stop();
      this.isRunning = false;
      console.log('Blog scheduler stopped');
    }
  }

  async checkScheduledPosts() {
    try {
      const now = new Date();
      
      // Find all scheduled posts where the scheduled time has passed
      const postsToPublish = await BlogPost.findAll({
        where: {
          status: 'scheduled',
          scheduled_at: {
            [Op.lte]: now
          }
        }
      });

      if (postsToPublish.length > 0) {
        console.log(`Found ${postsToPublish.length} scheduled posts ready to publish`);
        
        for (const post of postsToPublish) {
          try {
            await post.update({
              status: 'published',
              published_at: new Date(),
              scheduled_at: null // Clear the scheduled_at field
            });
            
            console.log(`Published scheduled post: "${post.title}" (ID: ${post.id})`);
          } catch (error) {
            console.error(`Error publishing scheduled post ${post.id}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error checking scheduled posts:', error.message);
    }
  }

  // Manual method to publish a specific scheduled post
  async publishScheduledPost(postId) {
    try {
      const post = await BlogPost.findByPk(postId);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      if (post.status !== 'scheduled') {
        throw new Error('Post is not scheduled');
      }
      
      await post.update({
        status: 'published',
        published_at: new Date(),
        scheduled_at: null
      });
      
      console.log(`Manually published scheduled post: "${post.title}" (ID: ${post.id})`);
      return post;
    } catch (error) {
      console.error(`Error manually publishing scheduled post ${postId}:`, error.message);
      throw error;
    }
  }

  // Get all currently scheduled posts
  async getScheduledPosts() {
    try {
      return await BlogPost.findAll({
        where: {
          status: 'scheduled'
        },
        order: [['scheduled_at', 'ASC']],
        attributes: ['id', 'title', 'slug', 'scheduled_at', 'created_at']
      });
    } catch (error) {
      console.error('Error fetching scheduled posts:', error.message);
      throw error;
    }
  }

  // Check if scheduler is running
  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.task ? 'Every minute' : 'Not scheduled'
    };
  }
}

// Create a singleton instance
const blogScheduler = new BlogScheduler();

module.exports = blogScheduler; 